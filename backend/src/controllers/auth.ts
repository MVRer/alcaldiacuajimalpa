const database = require('../config/database/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const logger = require(`../utils/logger`);

const secret = process.env.SECRET_KEY;


// const expressJwt = require('express-jwt');
// To protect routes -> const jwtMiddleware = expressJwt({ secret, algorithms: ['HS256'] });


class Authentication {
    async login(req, res) {
        const { username, password } = req.body;

        logger.info(`Login attempt for user: ${username || 'undefined'}`);

        if (!username || !password) {
            logger.warn('Login failed: missing username or password');
            return res.status(400).json({ message: 'Username and password are required' });
        }

        try {
            const user = await database.db.collection('users').findOne({ correo_electronico: username });
            
            if (!user) {
                logger.warn(`Login failed: user not found (${username})`);
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                logger.warn(`Login failed: incorrect password for ${username}`);
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            const { password: userPassword, ...userWithoutPassword } = user;
            const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '3d' });

            logger.info(`User ${username} logged in successfully`);
            return res.status(200).json({ user: userWithoutPassword, token: token });
        } catch (error) {
            logger.error(`Database error during login for ${username}: ${error.message}`);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async verifyToken(req) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            logger.warn('Token verification failed: no token provided');
            throw new Error('No token provided');
        }

        try {
            const decoded = jwt.verify(token, secret);
            logger.info(`Token verified successfully for user ID: ${decoded._id}`);
            return decoded;
        } catch (error) {
            logger.warn(`Token verification failed: ${error.message}`);
            throw new Error('Invalid token');
        }
    }

    async getPermissions(userId) {
        logger.debug(`Fetching permissions for user ID: ${userId}`);
        try {
            const user = await database.db.collection('users').findOne({ _id: new ObjectId(userId) });
            if (!user) {
                logger.warn(`User not found while fetching permissions: ${userId}`);
                throw new Error('User not found');
            }
            logger.info(`Permissions fetched for user ID: ${userId}`);
            return user.permissions || [];
        } catch (error) {
            logger.error(`Error fetching permissions for user ID ${userId}: ${error.message}`);
            throw new Error('Error fetching user permissions');
        }
    }

    async hasPermission(userId, permission) {
        logger.debug(`Checking permission '${permission}' for user ID: ${userId}`);
        try {
            const permissions = await this.getPermissions(userId);
            const hasPerm = permissions.includes('*') || permissions.includes(permission);
            logger.info(
                `Permission check for ${userId}: '${permission}' -> ${hasPerm ? 'GRANTED' : 'DENIED'}`
            );
            return hasPerm;
        } catch (error) {
            logger.error(`Error checking permission '${permission}' for ${userId}: ${error.message}`);
            throw new Error('Error checking user permissions');
        }
    }
    
}

export default new Authentication();