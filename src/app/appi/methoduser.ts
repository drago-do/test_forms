import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../models/conexion';
import User, { IUser } from '../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        // Obtener todos los usuarios de la base de datos
        const users: IUser[] = await User.find().exec();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        // Validar que el cuerpo de la solicitud tenga los datos necesarios
        const { firstName, lastName, email, password, phone } = req.body;

        if (!firstName || !lastName || !email || !password || !phone) {
          res.status(400).json({ success: false, message: 'Missing required fields' });
          return;
        }

        // Crear un nuevo usuario en la base de datos
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
      }
      break;

    default:
      // Si el método HTTP no es GET ni POST, devolver un error 405 (Método no permitido)
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
      break;
  }
}
