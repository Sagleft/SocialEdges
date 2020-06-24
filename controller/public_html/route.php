<?php
	session_start();
	require_once __DIR__ . "/../vendor/autoload.php";

	$handler = new \App\Controller\Handler();

	$route = $handler->dataFilter($_GET['route']);
	//delete slashs
	$route = str_replace('/', '', $route);

	if(!in_array($route, $accept_routes)) {
		$handler->user->redirect('/');
	}

	switch($route) {
		default:
			$handler->user->redirect('/');
		case 'login':
			if(! $handler->user->isAuth()) {
				$handler->user->authRequest();
			} else {
				//уже авторизован
				$handler->user->redirect('/');
			}
			break;
		case 'logout':
			$_SESSION = [];
			session_destroy();
			$handler->user->redirect('/');
			break;
	}
