import { Router } from 'express';
import authController from './controllers/auth';
import reportsController from './controllers/reports';
import usersController from './controllers/users';

const router = Router();

// Auth routes
router.post('/login', authController.login);


// ESTRUCTURA de rutas para un recurso ra-json-server
/*
getList	GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar
getOne	GET http://my.api.url/posts/123
getMany	GET http://my.api.url/posts?id=123&id=456&id=789
getManyReference	GET http://my.api.url/posts?author_id=345
create	POST http://my.api.url/posts
update	PUT http://my.api.url/posts/123
updateMany	PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
delete	DELETE http://my.api.url/posts/123
*/

// Reports routes

router.get('/reports', reportsController.getAllReports); // getList
router.get('/reports/:id', reportsController.getReportById); // getOne
router.post('/reports', reportsController.createReport); // create
router.put('/reports/:id', reportsController.updateReport); // update
router.delete('/reports/:id', reportsController.deleteReport); // delete

// My reports routes 

router.get('/my-reports', reportsController.getMyReports); // getList
router.get('/my-reports/:id', reportsController.getMyReportById); // getOne
router.post('/my-reports', reportsController.createReport); // create

// Turn reports routes

router.get('/turn-reports', reportsController.getTurnReports); // getList
router.get('/turn-reports/:id', reportsController.getTurnReportById); // getOne

// Users routes

router.get('/users', usersController.getAllUsers); // getList
router.get('/users/:id', usersController.getUserById); // getOne
router.post('/users', usersController.createUser); // create
router.put('/users/:id', usersController.updateUser); // update
router.delete('/users/:id', usersController.deleteUser); // delete

export default router; 