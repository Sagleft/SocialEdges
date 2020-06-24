<?php
	session_start();
	require_once __DIR__ . "/../vendor/autoload.php";

	//скрипт-роутер запросов на информационные страницы
	//можно всё это при желании уместить всего в один скрипт роутера
	$handler = new \App\Controller\Handler();

	$route = $handler->dataFilter($_GET['route']);
	//delete slashs
	$route = str_replace('/', '', $route);
	$accept_routes = ['faq'];

	if(!in_array($route, $accept_routes)) {
		$handler->user->redirect('/');
	}

	$handler->render([
		'tag'   => 'info',
		'title' => 'Info',
	'route' => $route,
		'user'  => $handler->user->data
	]);
