import { serve } from "https://deno.land/std@0.159.0/http/server.ts";

interface IProduct {
    name: string,
    price: number,
}

const productArr: IProduct[] = [];

const port = 8082;
const handler = async (req: Request): Promise<Response> => {
    if (req.method == "POST") {
        console.log("req.header",req.headers);
        if (
            req.headers.has("content-type") && 
            req.headers.get("content-type")?.startsWith("application/json")
            ) {
            const body: IProduct = await req.json()
            const newProductString = JSON.stringify(body)
            const newProduct = await JSON.parse(newProductString)
            productArr.push(newProduct);
            console.log("newProduct: ",newProduct);
            console.log("productArr: ",productArr);
            return new Response(JSON.stringify(productArr), { status: 200 })
        } else {
            return new Response("Error! Espera formato json", { status: 200, headers: {
                "content-type": "text/html; charset=UTF-8"
            } })
        }
    } else {
        return new Response(`
        <html>
          <body>
              desde postman realizar POST a http://localhost:8082/ con el siguiente body en formato raw con el siguiente formato: <br>
              {<br>
                "name": "prod1",<br>
                "price": 10<br>
              }<br>
              la respuesta sera un array de los productos enviados
          </body>
        </html>`, { headers: {
            "content-type": "text/html; charset=UTF-8"
        } })
    }
};

await serve(handler, { port });