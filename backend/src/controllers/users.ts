const database = require('../config/database/database');
import authController from './auth';
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const logger = require(`../utils/logger`);


class UsersController {
    async getAllUsers(req: any, res: any) {
        logger.info('ReportsController.getAllUsers called');
        logger.debug(`Request query: ${JSON.stringify(req.query)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to fetch all users: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting getAllUsers operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_users');
        logger.debug(`User ${user._id} permission 'view_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to access all users without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            if ("_sort" in req.query) {
                const { _sort, _order, _start, _end } = req.query;
                logger.info(`Applying sorting and pagination for users: ${_sort} (${_order}), range ${_start}-${_end}`);

                let sortBy = _sort;
                let order = _order === 'ASC' ? 1 : -1;
                let startNumber = Number(_start) || 0;
                let endNumber = Number(_end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;

                logger.debug(`MongoDB sort object: ${JSON.stringify(sorter)}`);
                logger.debug(`Pagination range: start=${startNumber}, end=${endNumber}`);

                const users = await database.db
                    .collection('users')
                    .find()
                    .sort(sorter)
                    .skip(startNumber)
                    .limit(endNumber - startNumber)
                    .toArray();

                const totalUsers = await database.db.collection('users').countDocuments();
                const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }: { [key: string]: any }) => userWithoutPassword);

                logger.info(`Fetched ${usersWithoutPasswords.length}/${totalUsers} users (sorted) for user ${user._id}.`);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalUsers);
                return res.status(200).json(usersWithoutPasswords);
            }

            logger.info(`Fetching all users without sorting for user ${user._id}.`);
            const users = await database.db.collection('users').find().toArray();
            const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }: { [key: string]: any }) => userWithoutPassword);

            logger.info(`Fetched ${usersWithoutPasswords.length} users for user ${user._id}.`);

            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', usersWithoutPasswords.length);
            return res.status(200).json(usersWithoutPasswords);
        } catch (error) {
            console.error('Error fetching users:', error);
            logger.error(`Error fetching users for user ${user._id}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req: any, res: any) {
        logger.info('ReportsController.getUserById called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const { id } = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to fetch user ${id}: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting getUserById operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_users');
        logger.debug(`User ${user._id} permission 'view_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to access user ${id} data without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            logger.info(`Fetching user with ID: ${id}`);
            const foundUser = await database.db.collection('users').findOne({ _id: new ObjectId(id) });

            if (!foundUser) {
                logger.warn(`User with ID ${id} not found.`);
                return res.status(404).json({ message: 'User not found' });
            }

            const { password, ...userWithoutPassword } = foundUser;
            logger.info(`User ${id} fetched successfully by admin ${user._id}.`);
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Error fetching user:', error);
            logger.error(`Error fetching user ${id}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req: any, res: any) {
        logger.info('ReportsController.updateUser called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const { id } = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to update user ${id}: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting updateUser operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'edit_users');
        logger.debug(`User ${user._id} permission 'edit_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to update user ${id} without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { nombre, apellidos, fecha_nacimiento, telefono, correo_electronico, curp,
                direccion, role, turnos, contrasenia, permissions } = req.body;

        if (!nombre || !apellidos || !correo_electronico) {
            logger.warn(`Validation failed: Missing required fields for user update ${id}.`);
            return res.status(400).json({
                message: 'Required fields: nombre, apellidos, correo_electronico'
            });
        }

        if (correo_electronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
            logger.warn(`Validation failed: Invalid email format for user update ${id}.`);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (turnos && !Array.isArray(turnos)) {
            logger.warn(`Validation failed: 'turnos' must be an array for user update ${id}.`);
            return res.status(400).json({ message: 'turnos must be an array' });
        }

        if (permissions && !Array.isArray(permissions)) {
            logger.warn(`Validation failed: 'permissions' must be an array for user update ${id}.`);
            return res.status(400).json({ message: 'permissions must be an array' });
        }

        try {
            logger.info(`Preparing update payload for user ${id}.`);
            const updateData: any = {
                nombre, apellidos, fecha_nacimiento, telefono, correo_electronico,
                curp, direccion, role, turnos, permissions, updatedAt: new Date()
            };

            if (contrasenia) {
                logger.info(`Hashing password for user ${id}.`);
                updateData.password = await bcrypt.hash(
                    contrasenia,
                    parseInt(process.env.SALT_ROUNDS || "10")
                );
            }

            logger.info(`Attempting to update user with ID: ${id}`);
            const updatedUser = await database.db.collection('users').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnOriginal: false }
            );

            if (!updatedUser.value) {
                logger.warn(`User with ID ${id} not found for update.`);
                return res.status(404).json({ message: 'User not found' });
            }

            const { password, ...userWithoutPassword } = updatedUser.value;
            logger.info(`User ${id} updated successfully by admin ${user._id}.`);
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Error updating user:', error);
            logger.error(`Error updating user ${id}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createUser(req: any, res: any) {
        logger.info('ReportsController.createUser called');
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to create user: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting createUser operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'create_users');
        logger.debug(`User ${user._id} permission 'create_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to create a new user without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { nombre, apellidos, fecha_nacimiento, telefono, correo_electronico, curp,
                direccion, role, turnos, contrasenia, permissions } = req.body;

        if (!nombre || !apellidos || !correo_electronico || !contrasenia) {
            logger.warn('Validation failed: Missing required fields in createUser request.');
            return res.status(400).json({
                message: 'Required fields: nombre, apellidos, correo_electronico, contrasenia'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
            logger.warn(`Validation failed: Invalid email format (${correo_electronico}).`);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (turnos && !Array.isArray(turnos)) {
            logger.warn('Validation failed: "turnos" must be an array.');
            return res.status(400).json({ message: 'turnos must be an array' });
        }

        if (permissions && !Array.isArray(permissions)) {
            logger.warn('Validation failed: "permissions" must be an array.');
            return res.status(400).json({ message: 'permissions must be an array' });
        }

        try {
            logger.info(`Checking if user with email ${correo_electronico} already exists.`);
            const existingUser = await database.db.collection('users').findOne({ correo_electronico });

            if (existingUser) {
                logger.warn(`Duplicate user creation attempt: email ${correo_electronico} already exists.`);
                return res.status(409).json({ message: 'User with this email already exists' });
            }

            logger.info(`Hashing password for new user ${correo_electronico}.`);
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

            logger.info(`Inserting new user record for ${correo_electronico} created by ${user._id}.`);
            await database.db.collection('users').insertOne(newUser);

            const { password, ...userWithoutPassword } = newUser;
            logger.info(`User ${correo_electronico} created successfully by ${user._id}.`);
            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('Error creating user:', error);
            logger.error(`Error creating user ${req.body.correo_electronico || 'unknown'}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteUser(req: any, res: any) {
        logger.info('ReportsController.deleteUser called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const { id } = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to delete user ${id}: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting deleteUser operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'delete_users');
        logger.debug(`User ${user._id} permission 'delete_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to delete user ${id} without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            logger.info(`Attempting to delete user with ID: ${id}`);
            const deletedUser = await database.db.collection('users').findOneAndDelete({ _id: new ObjectId(id) });

            if (!deletedUser.value) {
                logger.warn(`User with ID ${id} not found for deletion.`);
                return res.status(404).json({ message: 'User not found' });
            }

            logger.info(`User ${id} deleted successfully by admin ${user._id}.`);
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            logger.error(`Error deleting user ${id}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTurnUsers(req: any, res: any) { // TurnChief must be able to see users that are assigned to the turns he is assigned
        logger.info('ReportsController.getTurnUsers called');
        logger.debug(`Request query: ${JSON.stringify(req.query)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to fetch turn users: ${err.message}`);
            return res.status(401).json({ message: err.message });
        });

        if (!user) {
            logger.warn('User verification failed, aborting getTurnUsers operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_turn_users');
        logger.debug(`User ${user._id} permission 'view_turn_users': ${hasPermission}`);

        if (hasPermission === false) {
            logger.warn(`User ${user._id} attempted to access turn users without permission.`);
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            logger.info(`Fetching user info for user ID: ${user._id}`);
            const userInfo = await database.db.collection('users').findOne({ _id: new ObjectId(user._id) });

            if (!userInfo) {
                logger.warn(`User info not found for ID: ${user._id} while fetching turn users.`);
                return res.status(404).json({ message: 'User not found' });
            }

            const assignedTurns = userInfo.turnos || [];
            logger.info(`User ${user._id} has assigned turns: ${JSON.stringify(assignedTurns)}`);

            const query = { turnos: { $in: assignedTurns } };
            logger.debug(`MongoDB query for fetching turn users: ${JSON.stringify(query)}`);

            if ("_sort" in req.query) {
                const { _sort, _order, _start, _end } = req.query;
                logger.info(`Applying sorting and pagination for turn users: ${_sort} (${_order}), range ${_start}-${_end}`);

                let sortBy = _sort;
                let order = _order === 'ASC' ? 1 : -1;
                let startNumber = Number(_start) || 0;
                let endNumber = Number(_end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;

                logger.debug(`MongoDB sort object: ${JSON.stringify(sorter)}`);
                logger.debug(`Pagination range: start=${startNumber}, end=${endNumber}`);

                const users = await database.db
                    .collection('users')
                    .find(query)
                    .sort(sorter)
                    .skip(startNumber)
                    .limit(endNumber - startNumber)
                    .toArray();

                const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }: { [key: string]: any }) => userWithoutPassword);
                const totalUsers = await database.db.collection('users').countDocuments(query);

                logger.info(`User ${user._id} fetched ${usersWithoutPasswords.length}/${totalUsers} turn users (sorted).`);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalUsers);
                return res.status(200).json(usersWithoutPasswords);
            }

            logger.info(`Fetching all turn users for user ${user._id} without sorting.`);
            const users = await database.db.collection('users').find(query).toArray();
            const usersWithoutPasswords = users.map(({ password, ...userWithoutPassword }: { [key: string]: any }) => userWithoutPassword);

            logger.info(`User ${user._id} fetched ${usersWithoutPasswords.length} turn users.`);
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', usersWithoutPasswords.length);
            return res.status(200).json(usersWithoutPasswords);
        } catch (error) {
            console.error('Error fetching users:', error);
            logger.error(`Error fetching turn users for user ${user._id}: ${error.message}`, { stack: error.stack });
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTurnUserById(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_turn_users') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const foundUser = await database.db.collection('users').findOne({ _id: new ObjectId(id) });
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const currentUserInfo = await database.db.collection('users').findOne({ _id: new ObjectId(user._id) });
            if (!currentUserInfo) {
                return res.status(404).json({ message: 'Current user not found' });
            }

            const currentUserTurnos = currentUserInfo.turnos || [];
            const foundUserTurnos = foundUser.turnos || [];

            if (!currentUserTurnos.some((turn: string) => foundUserTurnos.includes(turn))) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const { password, ...userWithoutPassword } = foundUser;
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new UsersController();
