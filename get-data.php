<?php
	
	// Error Code
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	// Google/SpreadSheet/DefaultServiceRequest.php
	// CURLOPT_SSL_VERIFYPEER => false / true.

	require_once 'includes/library/google-api-php-client/src/Google_Client.php';

	$client = new Google_Client();
	$client->setClientId('846800622892-b3ailjukc9a92a6p19ctsi4hl8mj5fko.apps.googleusercontent.com');
	$client->setClientSecret('_RSygO4eR-h5FzE4Wu8Lw0IS');
	$client->setRedirectUri('https://developers.google.com/oauthplayground');
	$client->setScopes('https://spreadsheets.google.com/feeds/');
	$client->setState('offline');

	//$client->setAccessToken($config['token']); // The access JSON object.

	$client->refreshToken('1/Qdw5j7wL_81XLt7IxMkP3Kw2pSbvZLUKh-GidlkOpL4'); // Will return error here

	$data = json_decode( $client->getAccessToken() );
	$accessToken = $data->access_token;

	// Save the data last so we have had the chance to send a copy via email.

	require_once 'includes/library/Google/Spreadsheet/Autoloader.php';

	//$accessToken = 'ya29.1.AADtN_V5rIfJ72WGJcYssISBsqIVsWQBPu3OSEc8yn28SWZPiNYApkhtTgp4EQ';
	$request = new Google\Spreadsheet\Request($accessToken);
	$serviceRequest = new Google\Spreadsheet\DefaultServiceRequest($request);
	Google\Spreadsheet\ServiceRequestFactory::setInstance($serviceRequest);

	$spreadsheetService = new Google\Spreadsheet\SpreadsheetService();
	$spreadsheetFeed = $spreadsheetService->getSpreadsheets();
	$spreadsheet = $spreadsheetFeed->getByTitle('waxcloud - 26370');
	$worksheetFeed = $spreadsheet->getWorksheets();
	$worksheet = $worksheetFeed->getByTitle('Sheet1');
	$listFeed = $worksheet->getListFeed();
	$entries = $listFeed->getEntries();


	//$array[] = $rows;
	$rows = array();

	foreach ($entries as $entry) {
	    $values = $entry->getValues();

	    //echo $values["name"];
	    array_push( $rows , $values );
	}

	echo json_encode( array_reverse($rows) );

	// $row = array(
	// 	'id' => $_POST['id'],
	// 	'name' => $_POST['name'],
	// 	'slug' => $_POST['name'],
	// 	'img' => $_POST['img']
	// );

	// $listFeed->insert($row);

?>