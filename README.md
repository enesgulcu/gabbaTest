## package.json içerisindeki buld yapısını aşağıdaki gibi uygula. yoksa vercel'de fetch işlemlerini gerçekleştiremezsin!

"scripts": {
  "build": "prisma generate && next build"
}