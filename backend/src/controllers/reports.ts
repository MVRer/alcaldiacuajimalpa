const database = require('../config/database/database');
import authController from './auth';


class ReportsController {
    async getAllReports(req: any, res: any) { // getList

        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_reports') === false) {
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
                const reports = await database.db.collection('reports').find().sort(sorter).skip(startNumber).limit(endNumber - startNumber).toArray();
                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                const totalReports = await database.db.collection('reports').countDocuments();
                res.set('X-Total-Count', totalReports);
                return res.status(200).json(reports);
            }
            const reports = await database.db.collection('reports').find().toArray();
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', reports.length);
            return res.status(200).json(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReportById(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'view_reports') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const report = await database.db.collection('reports').findOne({ _id: id });
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }
            return res.status(200).json(report);
        } catch (error) {
            console.error('Error fetching report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateReport(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'edit_reports') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal, modo_de_activacion,
                gravedad_emergencia, tipo_servicio, tiempo_translado, kilometros_recorridos,
                dictamen, trabaja_realizado, nombres_afectados, dependencias_participantes,
                observaciones, otros } = req.body;

        if (!folio || !tiempo_fecha || !ubi || !modo_de_activacion || !tipo_servicio || tipo_servicio.length === 0) {
            return res.status(400).json({ message: 'Required fields: folio, tiempo_fecha, ubi, modo_de_activacion, tipo_servicio' });
        }

        if (typeof folio !== 'number' || typeof gravedad_emergencia !== 'number') {
            return res.status(400).json({ message: 'Invalid data types' });
        }

        if (!Array.isArray(tipo_servicio)) {
            return res.status(400).json({ message: 'tipo_servicio must be an array' });
        }

        try {
            const updatedReport = await database.db.collection('reports').findOneAndUpdate(
                { _id: id },
                { $set: {
                    folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal,
                    modo_de_activacion, gravedad_emergencia, tipo_servicio, tiempo_translado,
                    kilometros_recorridos, dictamen, trabaja_realizado, nombres_afectados,
                    dependencias_participantes, observaciones, otros, updatedAt: new Date()
                } },
                { returnOriginal: false }
            );
            if (!updatedReport.value) {
                return res.status(404).json({ message: 'Report not found' });
            }
            return res.status(200).json(updatedReport.value);
        } catch (error) {
            console.error('Error updating report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createReport(req: any, res: any) {
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'create_reports') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal, modo_de_activacion,
                gravedad_emergencia, tipo_servicio, tiempo_translado, kilometros_recorridos,
                dictamen, trabaja_realizado, nombres_afectados, dependencias_participantes,
                observaciones, otros } = req.body;

        if (!folio || !tiempo_fecha || !ubi || !modo_de_activacion || !tipo_servicio || tipo_servicio.length === 0) {
            return res.status(400).json({ message: 'Required fields: folio, tiempo_fecha, ubi, modo_de_activacion, tipo_servicio' });
        }

        if (typeof folio !== 'number' || typeof gravedad_emergencia !== 'number') {
            return res.status(400).json({ message: 'Invalid data types' });
        }

        if (!Array.isArray(tipo_servicio)) {
            return res.status(400).json({ message: 'tipo_servicio must be an array' });
        }

        try {
            const userInfo = await database.db.collection('users').findOne({ _id: user._id });
            if (!userInfo) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newReport = {
                folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal,
                modo_de_activacion, gravedad_emergencia, tipo_servicio, tiempo_translado,
                kilometros_recorridos, dictamen, trabaja_realizado, nombres_afectados,
                dependencias_participantes, observaciones, otros,
                createdBy: user._id,
                usuario_reportando: userInfo.nombre + ' ' + userInfo.apellidos,
                turno: userInfo.turno,
                createdAt: new Date()
            };
            await database.db.collection('reports').insertOne(newReport);
            return res.status(201).json(newReport);
        } catch (error) {
            console.error('Error creating report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteReport(req: any, res: any) {
        const { id } = req.params;
        const user = await authController.verifyToken(req).catch((err) => {
            return res.status(401).json({ message: err.message });
        });
        if (await authController.hasPermission(user._id, 'delete_reports') === false) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const deletedReport = await database.db.collection('reports').findOneAndDelete({ _id: id });
            if (!deletedReport.value) {
                return res.status(404).json({ message: 'Report not found' });
            }
            return res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            console.error('Error deleting report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new ReportsController();