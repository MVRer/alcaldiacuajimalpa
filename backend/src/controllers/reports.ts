import database from '../config/database/database';
import authController from './auth';
import { ObjectId } from 'mongodb';
import logger from '../utils/logger';


class ReportsController {
    async getAllReports(req: any, res: any) {

        logger.info('ReportsController.getAllReports called');
        logger.debug(`Query parameters: ${JSON.stringify(req.query)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized access attempt: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, stopping request handling.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_reports');
        logger.debug(`User ${user._id} permission 'view_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to access reports without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            if ("_sort" in req.query) {
                const {_sort, _order, _start, _end} = req.query;
                logger.info(`Applying sorting: ${_sort} (${_order}), pagination ${_start}-${_end}`);

                let sortBy = _sort;
                let order = _order === 'ASC' ? 1 : -1;
                let startNumber = Number(_start) || 0;
                let endNumber = Number(_end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;

                logger.debug(`MongoDB sort object: ${JSON.stringify(sorter)}`);
                logger.debug(`Pagination range: start=${startNumber}, end=${endNumber}`);

                const reports = await database.db
                    .collection('reports')
                    .find()
                    .sort(sorter)
                    .skip(startNumber)
                    .limit(endNumber - startNumber)
                    .toArray();

                const totalReports = await database.db.collection('reports').countDocuments();

                logger.info(`Fetched ${reports.length} sorted reports out of ${totalReports} total.`);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalReports);
                return res.status(200).json(reports);
            }

            logger.info('Fetching all reports without sorting/pagination.');
            const reports = await database.db.collection('reports').find().toArray();
            logger.info(`Fetched ${reports.length} reports.`);

            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', reports.length);
            return res.status(200).json(reports);
        } catch (error: any) {
            console.error('Error fetching reports:', error);
            logger.error(`Error fetching reports: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getReportById(req: any, res: any) {
        logger.info('ReportsController.getReportById called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const {id} = req.params;
        logger.debug(`Attempting to fetch report with ID: ${id}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized access attempt while fetching report ${id}: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting report fetch.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_reports');
        logger.debug(`User ${user._id} permission 'view_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to fetch report ${id} without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            const report = await database.db.collection('reports').findOne({_id: new ObjectId(id)});
            if (!report) {
                logger.warn(`Report with ID ${id} not found.`);
                return res.status(404).json({message: 'Report not found'});
            }

            logger.info(`Successfully fetched report with ID: ${id}`);
            return res.status(200).json(report);
        } catch (error: any) {
            console.error('Error fetching report:', error);
            logger.error(`Error fetching report ${id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async updateReport(req: any, res: any) {
        logger.info('ReportsController.updateReport called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const {id} = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized update attempt on report ${id}: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting update operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'edit_reports');
        logger.debug(`User ${user._id} permission 'edit_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to update report ${id} without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        const {
            folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal, modo_de_activacion,
            gravedad_emergencia, tipo_servicio, tiempo_translado, kilometros_recorridos,
            dictamen, trabaja_realizado, nombres_afectados, dependencias_participantes,
            observaciones, otros
        } = req.body;

        if (!folio || !tiempo_fecha || !ubi || !modo_de_activacion || !tipo_servicio || tipo_servicio.length === 0) {
            logger.warn(`Validation failed for report update ${id}: Missing required fields.`);
            return res.status(400).json({
                message: 'Required fields: folio, tiempo_fecha, ubi, modo_de_activacion, tipo_servicio'
            });
        }

        if (typeof folio !== 'number' || typeof gravedad_emergencia !== 'number') {
            logger.warn(`Validation failed for report update ${id}: Invalid data types.`);
            return res.status(400).json({message: 'Invalid data types'});
        }

        if (!Array.isArray(tipo_servicio)) {
            logger.warn(`Validation failed for report update ${id}: tipo_servicio is not an array.`);
            return res.status(400).json({message: 'tipo_servicio must be an array'});
        }

        try {
            logger.info(`Attempting to update report with ID: ${id}`);
            const updatedReport = await database.db.collection('reports').findOneAndUpdate(
                {_id: new ObjectId(id)},
                {
                    $set: {
                        folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal,
                        modo_de_activacion, gravedad_emergencia, tipo_servicio, tiempo_translado,
                        kilometros_recorridos, dictamen, trabaja_realizado, nombres_afectados,
                        dependencias_participantes, observaciones, otros, updatedAt: new Date()
                    }
                },
                {returnOriginal: false}
            );

            if (!updatedReport.value) {
                logger.warn(`Report with ID ${id} not found for update.`);
                return res.status(404).json({message: 'Report not found'});
            }

            logger.info(`Report ${id} updated successfully by user ${user._id}.`);
            return res.status(200).json(updatedReport.value);
        } catch (error: any) {
            console.error('Error updating report:', error);
            logger.error(`Error updating report ${id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async createReport(req: any, res: any) {
        logger.info('ReportsController.createReport called');
        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to create report: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting report creation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'create_reports');
        logger.debug(`User ${user._id} permission 'create_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to create a report without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        const {
            folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal, modo_de_activacion,
            gravedad_emergencia, tipo_servicio, tiempo_translado, kilometros_recorridos,
            dictamen, trabaja_realizado, nombres_afectados, dependencias_participantes,
            observaciones, otros
        } = req.body;

        if (!folio || !tiempo_fecha || !ubi || !modo_de_activacion || !tipo_servicio || tipo_servicio.length === 0) {
            logger.warn('Validation failed: Missing required fields in createReport.');
            return res.status(400).json({
                message: 'Required fields: folio, tiempo_fecha, ubi, modo_de_activacion, tipo_servicio'
            });
        }

        if (typeof folio !== 'number' || typeof gravedad_emergencia !== 'number') {
            logger.warn(`Validation failed: Invalid data types for report creation by user ${user._id}.`);
            return res.status(400).json({message: 'Invalid data types'});
        }

        if (!Array.isArray(tipo_servicio)) {
            logger.warn(`Validation failed: tipo_servicio is not an array for report creation by user ${user._id}.`);
            return res.status(400).json({message: 'tipo_servicio must be an array'});
        }

        try {
            logger.info(`Checking if report with folio ${folio} already exists.`);
            const existingReport = await database.db.collection('reports').findOne({folio});
            if (existingReport) {
                logger.warn(`Duplicate report creation attempt detected: folio ${folio} already exists.`);
                return res.status(409).json({message: 'A report with this folio already exists'});
            }

            logger.debug(`Fetching user information for user ID: ${user._id}`);
            const userInfo = await database.db.collection('users').findOne({_id: new ObjectId(user._id)});
            if (!userInfo) {
                logger.warn(`User info not found for ID: ${user._id} during report creation.`);
                return res.status(404).json({message: 'User not found'});
            }

            const newReport = {
                folio, tiempo_fecha, tiempo_fecha_atencion, ubi, codigoPostal,
                modo_de_activacion, gravedad_emergencia, tipo_servicio, tiempo_translado,
                kilometros_recorridos, dictamen, trabaja_realizado, nombres_afectados,
                dependencias_participantes, observaciones, otros,
                createdBy: new ObjectId(user._id),
                usuario_reportando: `${userInfo.nombre} ${userInfo.apellidos}`,
                turno: userInfo.turnos,
                createdAt: new Date()
            };

            logger.info(`Inserting new report with folio ${folio} by user ${user._id}.`);
            await database.db.collection('reports').insertOne(newReport);

            logger.info(`Report with folio ${folio} created successfully.`);
            return res.status(201).json(newReport);
        } catch (error: any) {
            console.error('Error creating report:', error);
            logger.error(`Error creating report: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async deleteReport(req: any, res: any) {
        logger.info('ReportsController.deleteReport called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const {id} = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to delete report ${id}: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting delete operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'delete_reports');
        logger.debug(`User ${user._id} permission 'delete_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to delete report ${id} without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            logger.info(`Attempting to delete report with ID: ${id}`);
            const deletedReport = await database.db.collection('reports').findOneAndDelete({_id: new ObjectId(id)});

            if (!deletedReport.value) {
                logger.warn(`Report with ID ${id} not found for deletion.`);
                return res.status(404).json({message: 'Report not found'});
            }

            logger.info(`Report ${id} deleted successfully by user ${user._id}.`);
            return res.status(200).json({message: 'Report deleted successfully'});
        } catch (error: any) {
            console.error('Error deleting report:', error);
            logger.error(`Error deleting report ${id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getMyReports(req: any, res: any) {
        logger.info('ReportsController.getMyReports called');
        logger.debug(`Request query: ${JSON.stringify(req.query)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to fetch personal reports: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting personal report retrieval.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_my_reports');
        logger.debug(`User ${user._id} permission 'view_my_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to access personal reports without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            const query = {createdBy: new ObjectId(user._id)};
            logger.info(`Fetching reports for user ${user._id} with query: ${JSON.stringify(query)}`);

            if ("_sort" in req.query) {
                const {_sort, _order, _start, _end} = req.query;
                logger.info(`Applying sorting and pagination for user ${user._id}: ${_sort} (${_order}), range ${_start}-${_end}`);

                let sortBy = _sort;
                let order = _order === 'ASC' ? 1 : -1;
                let startNumber = Number(_start) || 0;
                let endNumber = Number(_end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;

                logger.debug(`MongoDB sort object: ${JSON.stringify(sorter)}`);
                logger.debug(`Pagination range: start=${startNumber}, end=${endNumber}`);

                const reports = await database.db
                    .collection('reports')
                    .find(query)
                    .sort(sorter)
                    .skip(startNumber)
                    .limit(endNumber - startNumber)
                    .toArray();

                const totalReports = await database.db.collection('reports').countDocuments(query);
                logger.info(`User ${user._id} fetched ${reports.length}/${totalReports} personal reports (sorted).`);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalReports);
                return res.status(200).json(reports);
            }

            logger.info(`Fetching all personal reports for user ${user._id} without sorting.`);
            const reports = await database.db.collection('reports').find(query).toArray();
            logger.info(`User ${user._id} fetched ${reports.length} personal reports.`);

            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', reports.length);
            return res.status(200).json(reports);
        } catch (error: any) {
            console.error('Error fetching my reports:', error);
            logger.error(`Error fetching personal reports for user ${user._id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getMyReportById(req: any, res: any) {
        logger.info('ReportsController.getMyReportById called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const {id} = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to access personal report ${id}: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting getMyReportById operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_my_reports');
        logger.debug(`User ${user._id} permission 'view_my_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to access personal report ${id} without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            logger.info(`Fetching personal report with ID: ${id} for user ${user._id}`);
            const report = await database.db.collection('reports').findOne({_id: new ObjectId(id)});

            if (!report) {
                logger.warn(`Report with ID ${id} not found for user ${user._id}.`);
                return res.status(404).json({message: 'Report not found'});
            }

            if (report.createdBy && report.createdBy.toString() !== user._id) {
                logger.warn(`User ${user._id} attempted to access report ${id} they do not own.`);
                return res.status(403).json({message: 'Access denied'});
            }

            logger.info(`User ${user._id} successfully fetched personal report ${id}.`);
            return res.status(200).json(report);
        } catch (error: any) {
            console.error('Error fetching my report:', error);
            logger.error(`Error fetching personal report ${id} for user ${user._id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getTurnReports(req: any, res: any) {
        logger.info('ReportsController.getTurnReports called');
        logger.debug(`Request query: ${JSON.stringify(req.query)}`);

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to fetch turn reports: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting getTurnReports operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_turn_reports');
        logger.debug(`User ${user._id} permission 'view_turn_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to access turn reports without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            logger.info(`Fetching user info for user ID: ${user._id}`);
            const userInfo = await database.db.collection('users').findOne({_id: new ObjectId(user._id)});

            if (!userInfo) {
                logger.warn(`User info not found for ID: ${user._id} while fetching turn reports.`);
                return res.status(404).json({message: 'User not found'});
            }

            const query = {turno: {$in: userInfo.turnos || []}};
            logger.info(`Fetching turn reports for user ${user._id} with query: ${JSON.stringify(query)}`);

            if ("_sort" in req.query) {
                const {_sort, _order, _start, _end} = req.query;
                logger.info(`Applying sorting and pagination for turn reports: ${_sort} (${_order}), range ${_start}-${_end}`);

                let sortBy = _sort;
                let order = _order === 'ASC' ? 1 : -1;
                let startNumber = Number(_start) || 0;
                let endNumber = Number(_end) || 24;
                let sorter: { [key: string]: number } = {};
                sorter[sortBy] = order;

                logger.debug(`MongoDB sort object: ${JSON.stringify(sorter)}`);
                logger.debug(`Pagination range: start=${startNumber}, end=${endNumber}`);

                const reports = await database.db
                    .collection('reports')
                    .find(query)
                    .sort(sorter)
                    .skip(startNumber)
                    .limit(endNumber - startNumber)
                    .toArray();

                const totalReports = await database.db.collection('reports').countDocuments(query);
                logger.info(`User ${user._id} fetched ${reports.length}/${totalReports} turn reports (sorted).`);

                res.set('Access-Control-Expose-Headers', 'X-Total-Count');
                res.set('X-Total-Count', totalReports);
                return res.status(200).json(reports);
            }

            logger.info(`Fetching all turn reports for user ${user._id} without sorting.`);
            const reports = await database.db.collection('reports').find(query).toArray();
            logger.info(`User ${user._id} fetched ${reports.length} turn reports.`);

            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.set('X-Total-Count', reports.length);
            return res.status(200).json(reports);
        } catch (error: any) {
            console.error('Error fetching turn reports:', error);
            logger.error(`Error fetching turn reports for user ${user._id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async getTurnReportById(req: any, res: any) {
        logger.info('ReportsController.getTurnReportById called');
        logger.debug(`Request params: ${JSON.stringify(req.params)}`);

        const {id} = req.params;

        const user = await authController.verifyToken(req).catch((err) => {
            logger.warn(`Unauthorized attempt to access turn report ${id}: ${err.message}`);
            return res.status(401).json({message: err.message});
        });

        if (!user) {
            logger.warn('User verification failed, aborting getTurnReportById operation.');
            return;
        }

        const hasPermission = await authController.hasPermission(user._id, 'view_turn_reports');
        logger.debug(`User ${user._id} permission 'view_turn_reports': ${hasPermission}`);

        if (!hasPermission) {
            logger.warn(`User ${user._id} attempted to access turn report ${id} without permission.`);
            return res.status(403).json({message: 'Forbidden'});
        }

        try {
            logger.info(`Fetching report with ID: ${id}`);
            const report = await database.db.collection('reports').findOne({_id: new ObjectId(id)});

            if (!report) {
                logger.warn(`Report with ID ${id} not found.`);
                return res.status(404).json({message: 'Report not found'});
            }

            logger.debug(`Fetching user info for ID: ${user._id}`);
            const userInfo = await database.db.collection('users').findOne({_id: new ObjectId(user._id)});

            if (!userInfo) {
                logger.warn(`User info not found for ID: ${user._id} while fetching turn report ${id}.`);
                return res.status(404).json({message: 'User not found'});
            }

            const userTurnos = userInfo.turnos || [];
            const reportTurno = report.turno;
            logger.debug(`User ${user._id} turnos: ${JSON.stringify(userTurnos)}, report turno: ${reportTurno}`);

            const hasAccess = userTurnos.some((turn: string) => reportTurno && reportTurno.includes(turn));

            if (!hasAccess) {
                logger.warn(`User ${user._id} denied access to report ${id} — mismatched turn assignments.`);
                return res.status(403).json({message: 'Access denied'});
            }

            logger.info(`User ${user._id} successfully fetched turn report ${id}.`);
            return res.status(200).json(report);
        } catch (error: any) {
            console.error('Error fetching turn report:', error);
            logger.error(`Error fetching turn report ${id} for user ${user._id}: ${error.message}`, {stack: error.stack});
            return res.status(500).json({message: 'Internal server error'});
        }
    }

}

export default new ReportsController();