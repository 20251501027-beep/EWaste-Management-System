import 'dart:convert';
import 'package:http/http.dart' as http;

/// Configure this URL for the device on which Flutter is running:
/// Windows desktop / Flutter web: http://localhost:8080
/// Android emulator: http://10.0.2.2:8080
/// Physical phone: http://YOUR_PC_LAN_IP:8080 (same Wi-Fi; allow firewall access)
class EwasteApiService {
  static const String baseUrl = String.fromEnvironment(
    'EWASTE_API_URL',
    defaultValue: 'http://localhost:8080',
  );

  final http.Client _client;
  EwasteApiService({http.Client? client}) : _client = client ?? http.Client();

  Future<bool> checkHealth() async {
    try {
      final response = await _client
          .get(Uri.parse('$baseUrl/api/health'))
          .timeout(const Duration(seconds: 3));
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>> createItem(Map<String, dynamic> item) async {
    final response = await _client
        .post(
          Uri.parse('$baseUrl/api/items'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(item),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Create item failed: ${response.statusCode} ${response.body}');
    }
    return _decode(response.body);
  }

  Future<Map<String, dynamic>> createRequest(
      Map<String, dynamic> request) async {
    final response = await _client
        .post(
          Uri.parse('$baseUrl/api/requests'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(request),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Create pickup request failed: ${response.statusCode} ${response.body}');
    }
    return _decode(response.body);
  }

  Future<List<dynamic>> getItems() async {
    final response = await _client
        .get(Uri.parse('$baseUrl/api/items'))
        .timeout(const Duration(seconds: 8));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Get items failed: ${response.statusCode}');
    }
    final decoded = jsonDecode(response.body);
    return decoded is List ? decoded : (decoded['items'] as List<dynamic>? ?? []);
  }

  Future<List<dynamic>> getRequests() async {
    final response = await _client
        .get(Uri.parse('$baseUrl/api/requests'))
        .timeout(const Duration(seconds: 8));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Get requests failed: ${response.statusCode}');
    }
    final decoded = jsonDecode(response.body);
    return decoded is List ? decoded : (decoded['requests'] as List<dynamic>? ?? []);
  }

  Map<String, dynamic> _decode(String body) {
    if (body.trim().isEmpty) return <String, dynamic>{'success': true};
    final decoded = jsonDecode(body);
    if (decoded is Map<String, dynamic>) return decoded;
    return <String, dynamic>{'data': decoded};
  }

  void dispose() => _client.close();
}
