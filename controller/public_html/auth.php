<?php
	session_start();
	require_once __DIR__ . "/../vendor/autoload.php";

	$handler = new \App\Controller\Handler();
	$code = $handler->dataFilter($_GET['code']);

	$handler->user->finishAuth($code);
	$handler->user->redirect('/');
