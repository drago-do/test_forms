import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../models/conexion'; 
import User, { IUser } from '../../models/user'; // Importa el modelo y la interfaz IUser

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Conectar a la base de datos
    await dbConnect();

    switch (req.method) {
      case 'GET':
        try {
          // Obtener todos los usuarios de la base de datos
          const users: IUser[] = await User.find().exec(); // Ejecutar la consulta
          res.status(200).json({ success: true, data: users });
        } catch (error) {
          res.status(400).json({ success: false, error: (error as Error).message });
        }
        break;

      case 'POST':
        try {
          // Crear un nuevo usuario en la base de datos
          const user = new User(req.body); // Crear una nueva instancia del modelo User
          await user.save(); // Guardar el nuevo usuario en la base de datos
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
  } catch (error) {
    res.status(500).json({ success: false, error: 'Database connection error.' });
  }
}
