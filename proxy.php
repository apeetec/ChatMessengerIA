<?php
// c:/wamp64/www/chat-messenger/proxy.php

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// 1. Garantir que apenas requisições POST são permitidas
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => ['message' => 'Método não permitido. Use POST.']]);
    exit;
}

// 2. Carregar a chave de API do arquivo .env de forma simples
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
    return true;
}

loadEnv(__DIR__ . '/.env');
$apiKey = $_ENV['OPENROUTER_API_KEY'] ?? null;

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => ['message' => 'Configuração do servidor ausente. Chave de API não encontrada no .env.']]);
    exit;
}

// 3. Obter o corpo exato da requisição enviado pelo front-end (mantendo a mesma estrutura de dados do usuário)
$rawInput = file_get_contents('php://input');

// 4. Encaminhar a requisição para o OpenRouter usando cURL
$url = "https://openrouter.ai/api/v1/chat/completions";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
    'HTTP-Referer: http://localhost/chat-messenger', // Necessário para o OpenRouter
    'X-Title: Chat Messenger Portfolio'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// 5. Retornar o resultado exatamente como o OpenRouter responderia
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => ['message' => 'Erro de conexão no proxy backend: ' . $curlError]]);
    exit;
}

http_response_code($httpCode);
echo $response;
