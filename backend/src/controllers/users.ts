const database = require('../config/database/database');
import authController from './auth';
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');


class UsersController {
    async getAllUsers(req: any, res: any) {
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            if ("_sort" in req.query) {
                let sortBy = req.query._sort;
                let order = req.query._order === 'ASC' ? 1 : -1;
                let startNumber = Number(req.query._start) || 0;
                let endNumber = Number(req.query._end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;
                const users = await database.db.collection('users').find().sort(sorter).skip(startNumber).limit(endNumber - startNumber).toArray();
                const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword } : { [key: string]: any }) => userWithoutPassword);
                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                const totalUsers = await database.db.collection('users').countDocuments();
                res.set('X-Total-Count', totalUsers);
                return res.status(200).json(usersWithoutPasswords);
            }
            const users = await database.db.collection('users').find().toArray();
            const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword } : { [key: string]: any }) => userWithoutPassword);
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', usersWithoutPasswords.length);
            return res.status(200).json(usersWithoutPasswords);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const foundUser = await database.db.collection('users').findOne({ _id: new ObjectId(id) });
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...userWithoutPassword } = foundUser;
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'edit_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { nombre, apellidos, fecha_nacimiento, telefono, correo_electronico, curp,
                direccion, role, turnos, contrasenia, permissions } = req.body;

        if (!nombre || !apellidos || !correo_electronico) {
            return res.status(400).json({ message: 'Required fields: nombre, apellidos, correo_electronico' });
        }

        if (correo_electronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (turnos && !Array.isArray(turnos)) {
            return res.status(400).json({ message: 'turnos must be an array' });
        }

        if (permissions && !Array.isArray(permissions)) {
            return res.status(400).json({ message: 'permissions must be an array' });
        }

        try {
            const updateData: any = {
                nombre, apellidos, fecha_nacimiento, telefono, correo_electronico,
                curp, direccion, role, turnos, permissions, updatedAt: new Date()
            };

            if (contrasenia) {
                updateData.password = await bcrypt.hash(contrasenia, parseInt(process.env.SALT_ROUNDS || "10"));
            }

            const updatedUser = await database.db.collection('users').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnOriginal: false }
            );
            if (!updatedUser.value) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...userWithoutPassword } = updatedUser.value;
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createUser(req: any, res: any) {
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'create_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { nombre, apellidos, fecha_nacimiento, telefono, correo_electronico, curp,
                direccion, role, turnos, contrasenia, permissions } = req.body;

        if (!nombre || !apellidos || !correo_electronico || !contrasenia) {
            return res.status(400).json({ message: 'Required fields: nombre, apellidos, correo_electronico, contrasenia' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (turnos && !Array.isArray(turnos)) {
            return res.status(400).json({ message: 'turnos must be an array' });
        }

        if (permissions && !Array.isArray(permissions)) {
            return res.status(400).json({ message: 'permissions must be an array' });
        }

        try {
            const existingUser = await database.db.collection('users').findOne({ correo_electronico });
            if (existingUser) {
                return res.status(409).json({ message: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(contrasenia, parseInt(process.env.SALT_ROUNDS || "10"));

            const newUser = {
                nombre, apellidos, fecha_nacimiento, telefono, correo_electronico,
                curp, direccion, role, turnos, permissions: permissions || [],
                password: hashedPassword,
                agregado_por: user._id,
                eliminado_por: null,
                fecha_registro: new Date().toISOString().split('T')[0],
                createdAt: new Date()
            };

            await database.db.collection('users').insertOne(newUser);
            const { password, ...userWithoutPassword } = newUser;
            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteUser(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'delete_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const deletedUser = await database.db.collection('users').findOneAndDelete({ _id: new ObjectId(id) });
            if (!deletedUser.value) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getTurnUsers(req: any, res: any) { // TurnChief must be able to see users that are asigned to the turns he is assigned 
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_turn_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            if ("_sort" in req.query) {
                let sortBy = req.query._sort;
                let order = req.query._order === 'ASC' ? 1 : -1;
                let startNumber = Number(req.query._start) || 0;
                let endNumber = Number(req.query._end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;
                const users = await database.db.collection('users').find().sort(sorter).skip(startNumber).limit(endNumber - startNumber).toArray();
                const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword } : { [key: string]: any }) => userWithoutPassword);
                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                const totalUsers = await database.db.collection('users').countDocuments();
                res.set('X-Total-Count', totalUsers);
                return res.status(200).json(usersWithoutPasswords);
            }
            const users = await database.db.collection('users').find().toArray();
            const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword } : { [key: string]: any }) => userWithoutPassword);
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', usersWithoutPasswords.length);
            return res.status(200).json(usersWithoutPasswords);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new UsersController();
