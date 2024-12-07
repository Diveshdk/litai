// import { getAuthSig, signTransaction } from '../../../utils/lit';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { transactionData } = req.body;

//   try {
//     const authSig = await getAuthSig();
//     const signedTransaction = await signTransaction(transactionData, authSig);

//     res.status(200).json({ signedTransaction });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to sign transaction' });
//   }
// }
