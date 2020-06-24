<?php
	session_start();
	require_once __DIR__ . "/../vendor/autoload.php";

	$handler = new \App\Controller\Handler();
	if($handler->user->isAuth()) {
		$page_tag = 'home';
	} else {
		$page_tag = 'showreel';
	}

	$handler->render([
		'tag'   => $page_tag,
		'title' => 'Main',
		'user'  => $handler->user->data
	]);
