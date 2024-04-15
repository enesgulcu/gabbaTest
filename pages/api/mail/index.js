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
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
    <h2 style="text-align: center; color: #333;">Şifre Sıfırlama</h2>
    <p>Merhaba,</p>
    <p>Sipraiş fişinize ulaşmak için aşağıdaki bağlantıya tıklayınız:</p>
    <p style="text-align: center; margin-top: 20px;"><a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Sipariş Fişi</a></p>
    <p style="margin-top: 20px;">Eğer bu işlemi siz gerçekleştirmediyseniz, lütfen Gabba ekibi ile iletişime geçiniz.</p>
    <p>İyi günler dileriz.</p>
    <p style="margin-top: 20px;">Gabba - Sistem Ekibi</p>
</div>

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