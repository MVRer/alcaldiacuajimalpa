import { Router } from 'express';
import authController from './controllers/auth';
import reportsController from './controllers/reports';
import usersController from './controllers/users';


/*
* ESTRUCTURA de rutas para recurso ra-json-server
* getList	        GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar
* getOne	        GET http://my.api.url/posts/123
* getMany	        GET http://my.api.url/posts?id=123&id=456&id=789
* getManyReference	GET http://my.api.url/posts?author_id=345
* create	        POST http://my.api.url/posts
* update	        PUT http://my.api.url/posts/123
* updateMany	    PUT http://my.api.url/posts/123
*                   PUT http://my.api.url/posts/456
*                   PUT http://my.api.url/posts/789
* delete	        DELETE http://my.api.url/posts/123
*/


const router = Router();

// Reports routes

const reports_routes = Router();

reports_routes.get('', reportsController.getAllReports);       // getList
reports_routes.get('/:id', reportsController.getReportById);   // getOne
reports_routes.post('', reportsController.createReport);       // create
reports_routes.put('/:id', reportsController.updateReport);    // update
reports_routes.delete('/:id', reportsController.deleteReport); // delete


// My reports routes 

const my_reports_routes = Router();

my_reports_routes.get('', reportsController.getMyReports);        // getList
my_reports_routes.get('/:id', reportsController.getMyReportById); // getOne
my_reports_routes.post('', reportsController.createReport);       // create


// Turn reports routes

const turn_reports_routes = Router();

turn_reports_routes.get('', reportsController.getTurnReports);        // getList
turn_reports_routes.get('/:id', reportsController.getTurnReportById); // getOne


// Users routes

const user_routes = Router();

user_routes.get('', usersController.getAllUsers);       // getList
user_routes.get('/:id', usersController.getUserById);   // getOne
user_routes.post('', usersController.createUser);       // create
user_routes.put('/:id', usersController.updateUser);    // update
user_routes.delete('/:id', usersController.deleteUser); // delete


// Turn users routes

const turn_user_routes = Router();

turn_user_routes.get('', usersController.getTurnUsers);         // getList
turn_user_routes.get('/:id', usersController.getTurnUserById);  // getOne


router.post('/login', authController.login);

router.use('/users', user_routes);
router.use('/reports', reports_routes);
router.use('/my-reports', my_reports_routes);
router.use('/turn-reports', turn_reports_routes);
router.use('/turn-reports', turn_reports_routes);


export default router; 