import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const result = await prisma[req.body].findMany({});
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
        }
    }
}