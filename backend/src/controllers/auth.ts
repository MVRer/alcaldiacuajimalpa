const database = require('../config/database/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const secret = process.env.SECRET_KEY;


// const expressJwt = require('express-jwt');
// To protect routes -> const jwtMiddleware = expressJwt({ secret, algorithms: ['HS256'] });


class Authentication {
    
    async login(req: any, res: any) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        try {
            const user = await database.db.collection('users').findOne({ correo_electronico: username });
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            const { password: userPassword, ...userWithoutPassword } = user;
            const token = jwt.sign({ id: userWithoutPassword.id }, process.env.SECRET_KEY, { expiresIn: '3d' });
            console.log('Generated Token for user:', userWithoutPassword.correo_electronico);
            return res.status(200).json({ user: userWithoutPassword, token: token });
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async verifyToken(req: any) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }
        try {
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    async getPermissions(userId: string) {
        try {
            const user = await database.db.collection('users').findOne({ _id: userId });
            if (!user) {
                throw new Error('User not found');
            }
            return user.permissions || [];
        } catch (error) {
            throw new Error('Error fetching user permissions');
        }
    }
    async hasPermission(userId: string, permission: string) {
        try {
            const permissions = await this.getPermissions(userId);
            return permissions.includes('*') || permissions.includes(permission);
        } catch (error) {
            throw new Error('Error checking user permissions');
        }
    }
    
}

export default new Authentication();