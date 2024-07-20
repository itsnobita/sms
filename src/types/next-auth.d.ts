import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      is_accepting_message?: boolean;
      name?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    is_accepting_message?: boolean;
    name?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    is_accepting_message?: boolean;
    name?: string;
  }
}