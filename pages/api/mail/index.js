import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export const mailOptions = {
    from: process.env.EMAIL,
}

const handler = async (req, res) => {
    //getServerSession:  Kullanıcının oturum açıp açmadığını kontrol eder. Eğer açılmışsa session değişkenine atar.

    if (req.method === 'POST') {
        try {
            const { email, url } = req.body;

            //mail gönderme işlemi
            transporter.sendMail({
                ...mailOptions,
                subject: `TEST`,
                html: `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gabba - Sipariş fişiniz</title>
</head>
<body>
<iframe src="https://gabba-medyanes-360.vercel.app/document?id=225329YUSUAJ94OH&lang=tr" frameborder="0"></iframe>
</body>
</html>
                `,
                to: email,
            })

            return res.status(200).json({ status: "success", message: "Şifre sıfırlama bağlantısı mail adresinize gönderildi." });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
    else {
        return res.status(405).json({ status: "error", message: "hatalı bir istek gerçekleştirdiniz." });
    }
};

export default handler;