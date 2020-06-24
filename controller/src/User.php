<?php
	namespace App\Controller;

	class User {
		public $data = [
			'uid'         => 0,  //user ID in db
			'freeland_id' => '', //blockchain user ID
			'nick_name'   => 'Anonymous',
			'is_auth'     => false,
			'hash'        => '', //md5 from email
			'email'       => '',
			'address'     => '' //mfcoin-address
		];
		public $last_error = '';

		protected $db = null;
		protected $oauth_client = null;
		protected $config = [];

		public function __construct(bool $need_checkAuth = false) {
			$this->data['is_auth']   = isset($_SESSION['uid']);
			if($this->data['is_auth']) {
				$this->data['uid']       = $_SESSION['uid'];
				/* $this->data['nick_name'] = $_SESSION['nick_name'];
				$this->data['email']     = $_SESSION['email'];
				$this->data['hash']      = md5($_SESSION['email']); */
			}

			if($need_checkAuth) {
				$this->checkAuth();
			}
		}

		public function checkAuth(): void {
			if($this->data['is_auth'] == false) {
				header('Location: /'); exit;
			}
		}

		public function setdb($db): void {
			$this->db = &$db;
		}

		public function redirect($url = '/') {
			header('Location: ' . $url); exit;
		}

		public function isAuth(): bool {
			return $this->data['is_auth'];
		}

		public function authRequest(): void {
			$query = http_build_query([
				'client_id'     => getenv('oauth_client_id'),
				'redirect_url'  => getenv('oauth_redirect_url'),
				'response_type' => 'code',
				'scope'         => ''
			]);
			$this->redirect('https://profile.mfcoin.net/oauth/authorize?' . $query);
		}

		protected function parseResponse($response): array {
			return json_decode((string) $response->getBody(), true);
    	}

		public function getUserData($code): array {
	        $response = $this->client->post('https://profile.mfcoin.net/oauth/token', [
	            'body' => [
	                'grant_type'    => 'authorization_code',
	                'client_id'     => $this->config['oauth_client_id'],
	                'client_secret' => $this->config['oauth_secret'],
	                'redirect_uri'  => $this->config['oauth_redirect_url'],
	                'code'          => $code
	            ]
	        ]);

	        return $this->parseResponse($response);
	    }

		public function finishAuth($code = ''): void {
			if($this->isAuth() || empty($code)) {
				return;
			}
			$user_data = $this->getUserData($code);
			//проверим, есть ли такой юзер
			//TODO
		}
	}
