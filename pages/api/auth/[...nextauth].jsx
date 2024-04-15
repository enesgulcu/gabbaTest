import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getDataByUnique } from '@/services/serviceOperations';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phoneNumber: { label: 'Phone Number', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          const { phoneNumber, password } = credentials;

          // email ve password boş ise hata fırlatıyoruz.
          if (!phoneNumber || !password) {
            throw new Error('Please enter your phoneNumber and password');
          }

          // email adresi veritabanında kayıtlı mı kontrol ediyoruz.
          const findUser = await getDataByUnique('User', {
            phoneNumber: phoneNumber,
          });

          // email adresi veritabanında kayıtlı değilse hata fırlatıyoruz.
          if (!findUser) {
            throw new Error('Kullanıcı bulunamadı.');
          }

          // Kullanıcı bilgilerini döndürüyoruz.
          const user = {
            id: findUser.id,
            name: findUser.name,
            surname: findUser.surname,
            email: findUser.email,
            phone: findUser.phoneNumber,
            role: findUser.role,
          };

          return findUser;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },

  // kullanıcı giriş yaptıktan sonra giriş yapan kullanıcının bilgilerini token değişkenine atıyoruz.
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 days * 24 hours * 60 minutes * 60 seconds
  },
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    // jwt fonksiyonu ile kullanıcı giriş yaptıktan sonra giriş yapan kullanıcının bilgilerini token değişkenine atıyoruz.
    // bu bilgileri session fonksiyonunda kullanacağız.
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },

    // Client Component içerisinde kullanılır.
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
