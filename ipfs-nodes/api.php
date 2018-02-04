<?php

// TODO: restrict access to this API.

const API_URL = 'http://localhost:5001/api/v0/';

$action = $_GET['a'];

switch($action) {
    case 'ls':
        die(file_get_contents(API_URL . 'pin/ls'));
    case 'add':
        $hash = $_GET['h'];
        die(file_get_contents(API_URL . 'pin/add?arg=' . $hash . '&recursive=true&progress=false'));
    case 'rm':
        $hash = $_GET['h'];
        die(file_get_contents(API_URL . 'pin/rm?arg=' . $hash . '&recursive=true'));
    default:
        die('Unknown command');
}

?>
