import "server-only";
import { createHmac } from "crypto";
import { decryptSecret } from "@/lib/secrets";
import type { OutputSection } from "@/types/launch";
type Config={endpoint:string;secret:string;listId?:string|null;senderEmail?:string|null;senderLabel?:string|null};
const escape=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
const render=(s:OutputSection[])=>s.map(x=>`<section><h2>${escape(x.title)}</h2>${Array.isArray(x.body)?`<ul>${x.body.map(v=>`<li>${escape(v)}</li>`).join("")}</ul>`:`<p>${escape(x.body).replace(/\n/g,"<br>")}</p>`}</section>`).join("");
export async function publishOutput(provider:string,raw:unknown,sections:OutputSection[],title:string){
  const config=raw as Config,secret=decryptSecret(config.secret),content=render(sections);
  if(provider==="shopify"){
    const response=await fetch(`https://${config.endpoint}/admin/api/2026-07/graphql.json`,{method:"POST",headers:{"content-type":"application/json","x-shopify-access-token":secret},body:JSON.stringify({query:"mutation CreateProduct($product: ProductCreateInput!) { productCreate(product: $product) { product { id handle } userErrors { message } } }",variables:{product:{title,descriptionHtml:content,status:"DRAFT"}}})});
    const result=await response.json() as {data?:{productCreate?:{product?:{id:string};userErrors:{message:string}[]}};errors?:{message:string}[]};const error=result.errors?.[0]?.message||result.data?.productCreate?.userErrors?.[0]?.message,product=result.data?.productCreate?.product;
    if(!response.ok||error||!product)throw new Error(error||"Shopify rejected the product.");return {externalId:product.id,externalUrl:`https://${config.endpoint}/admin/products/${product.id.split("/").pop()}`};
  }
  if(provider==="klaviyo"){
    if(!config.listId)throw new Error("A Klaviyo list ID is required.");
    const headers={Authorization:`Klaviyo-API-Key ${secret}`,accept:"application/vnd.api+json","content-type":"application/vnd.api+json",revision:"2026-07-15.pre"};
    const templateResponse=await fetch("https://a.klaviyo.com/api/templates",{method:"POST",headers,body:JSON.stringify({data:{type:"template",attributes:{name:`${title} · LaunchPilot`,editor_type:"CUSTOM_SOURCE",html:content,text:sections.map(s=>`${s.title}\n${Array.isArray(s.body)?s.body.join("\n"):s.body}`).join("\n\n")}}})});
    const templateResult=await templateResponse.json() as {data?:{id:string};errors?:{detail:string}[]};if(!templateResponse.ok||!templateResult.data)throw new Error(templateResult.errors?.[0]?.detail||"Klaviyo rejected the email template.");
    const senderEmail=config.senderEmail||config.endpoint,senderLabel=config.senderLabel||title;
    const response=await fetch("https://a.klaviyo.com/api/campaigns",{method:"POST",headers,body:JSON.stringify({data:{type:"campaign",attributes:{definition:{name:title,builder:"wizard",send_settings:{send_timezone:"UTC",send_strategy:"STATIC",send_passed_rltz_immediately:false,exit_condition_enabled:false,exit_condition_conversion_metric_id:null}},audiences:[{temporary_id:"launchpilot_audience",included:[config.listId],excluded:[]}],messages:[{audience_temporary_id:"launchpilot_audience",definition:{name:title,variations:[{definition:{name:"LaunchPilot email",details:{channel:"email",subject:title,from_email:senderEmail,from_label:senderLabel,template_id:templateResult.data.id}}}]}}]}}})});
    const result=await response.json() as {data?:{id:string};errors?:{detail:string}[]};if(!response.ok||!result.data)throw new Error(result.errors?.[0]?.detail||"Klaviyo rejected the campaign.");return {externalId:result.data.id,externalUrl:`https://www.klaviyo.com/campaign/${result.data.id}`};
  }
  if(provider==="webhook"){const body=JSON.stringify({title,sections}),signature=createHmac("sha256",secret).update(body).digest("hex"),response=await fetch(config.endpoint,{method:"POST",headers:{"content-type":"application/json","x-launchpilot-signature":`sha256=${signature}`},body});if(!response.ok)throw new Error(`Webhook returned ${response.status}.`);return {externalId:null,externalUrl:null}}
  throw new Error("Unsupported publishing provider.");
}
