import { admin } from '../../config';

function authFireBase() {
  const verifyToken = async (token: string) => {
    try {
      const res = await admin.auth().verifyIdToken(token);
      return {
        uid: res.uid,
        email: res.email,
        iat: res.iat,
        exp: res.exp,
      };
    } catch (error) {
      console.error('Token inválido:', error);
      throw new Error('Token inválido.');
    }
  };

  return {
    verifyToken,
  };
}

export default authFireBase;
