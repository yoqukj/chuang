<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// 只支持 POST 请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "code" => -1,
        "msg" => "仅支持 POST 请求"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 读取请求体
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// 检查请求格式
if (!isset($data['question']) || trim($data['question']) === '') {
    echo json_encode([
        "code" => -2,
        "msg" => "请提供题目字段 question"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$keyword = trim($data['question']);

// 读取题库
$path = __DIR__ . "/questions.json";
if (!file_exists($path)) {
    echo json_encode([
        "code" => -3,
        "msg" => "题库文件不存在"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$questions = json_decode(file_get_contents($path), true);
if (!is_array($questions)) {
    echo json_encode([
        "code" => -4,
        "msg" => "题库格式错误"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 匹配题目（模糊匹配）
$answer = null;
foreach ($questions as $item) {
    if (stripos($keyword, $item['question']) !== false || stripos($item['question'], $keyword) !== false) {
        $answer = $item['answer'];
        break;
    }
}

// 返回结果
if ($answer !== null) {
    echo json_encode([
        "code" => 0,
        "msg" => "success",
        "data" => $answer
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "code" => 1,
        "msg" => "未找到匹配的题目",
        "data" => ""
    ], JSON_UNESCAPED_UNICODE);
}
