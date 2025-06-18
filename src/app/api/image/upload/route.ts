import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export const POST = async (req: Request) => {

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  const arryBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arryBuffer);

  if(!userId){
    return NextResponse.json({error: "Não autorizado"}, {status: 401})
  }

  if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
    return NextResponse.json({error: "Formato não suportado"}, {status: 400})
  }

  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      tags:[`${userId}`],
      public_id: file.name,
    }, function(error, result) {
      if(error){
        reject(error)
      } else {
        resolve(result)
      }
    }).end(buffer)
  })

  

  return NextResponse.json(results)

}