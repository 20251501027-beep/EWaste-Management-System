import 'package:flutter/material.dart';
import 'api_service.dart';

void main() => runApp(const EwasteApp());

const green = Color(0xFF176B4D);
const mint = Color(0xFFE8F5EE);
const ink = Color(0xFF18231F);
const muted = Color(0xFF68766F);
const canvas = Color(0xFFF6F8F6);

class EwasteApp extends StatelessWidget {
  const EwasteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EcoCycle — E-Waste Management',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: canvas,
        colorScheme: ColorScheme.fromSeed(seedColor: green, brightness: Brightness.light),
        appBarTheme: const AppBarTheme(
          backgroundColor: canvas,
          foregroundColor: ink,
          elevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE0E7E2))),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE0E7E2))),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: green, width: 1.5)),
        ),
      ),
      home: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});
  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int selected = 0;
  final api = EwasteApiService();
  final List<Map<String, dynamic>> localItems = [];
  final List<Map<String, dynamic>> localRequests = [];
  bool backendOnline = false;
  bool checkingBackend = true;
  int rewardPoints = 0;

  @override
  void initState() {
    super.initState();
    _checkBackend();
  }

  Future<void> _checkBackend() async {
    final ok = await api.checkHealth();
    if (!mounted) return;
    setState(() {
      backendOnline = ok;
      checkingBackend = false;
    });
  }

  void _addItem(Map<String, dynamic> item) {
    setState(() {
      localItems.insert(0, item);
      rewardPoints += ((item['weight'] as num?)?.toDouble() ?? 0).round() * 10;
    });
    api.createItem(item).then((_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Item sent to C++ backend.')));
    }).catchError((_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Saved for this session only. C++ API is not connected yet.')),
      );
    });
  }

  void _addRequest(Map<String, dynamic> request) {
    setState(() => localRequests.insert(0, request));
    api.createRequest(request).then((_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pickup request sent to C++ backend.')));
    }).catchError((_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Request added for this session only. C++ API is not connected yet.')),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      DashboardPage(
        items: localItems,
        requests: localRequests,
        points: rewardPoints,
        backendOnline: backendOnline,
        checkingBackend: checkingBackend,
        onNavigate: (index) => setState(() => selected = index),
      ),
      RegisterItemPage(onSubmit: _addItem),
      PickupPage(onSubmit: _addRequest),
      RewardsPage(points: rewardPoints, items: localItems),
    ];
    return LayoutBuilder(builder: (context, constraints) {
      final wide = constraints.maxWidth >= 800;
      return Scaffold(
        body: Row(
          children: [
            if (wide) _SideNavigation(selected: selected, onSelect: (i) => setState(() => selected = i)),
            Expanded(
              child: Column(
                children: [
                  if (wide)
                    Container(
                      height: 76,
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      decoration: const BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: Color(0xFFE8ECE9)))),
                      child: Row(
                        children: [
                          const Icon(Icons.eco_rounded, color: green, size: 28),
                          const SizedBox(width: 10),
                          const Text('EcoCycle', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: ink)),
                          const Spacer(),
                          _BackendBadge(online: backendOnline, checking: checkingBackend),
                          const SizedBox(width: 18),
                          const CircleAvatar(backgroundColor: mint, child: Icon(Icons.person_outline, color: green)),
                        ],
                      ),
                    ),
                  Expanded(child: IndexedStack(index: selected, children: pages)),
                ],
              ),
            ),
          ],
        ),
        bottomNavigationBar: wide
            ? null
            : NavigationBar(
                selectedIndex: selected,
                onDestinationSelected: (i) => setState(() => selected = i),
                destinations: const [
                  NavigationDestination(icon: Icon(Icons.grid_view_rounded), label: 'Home'),
                  NavigationDestination(icon: Icon(Icons.add_box_outlined), label: 'Register'),
                  NavigationDestination(icon: Icon(Icons.local_shipping_outlined), label: 'Pickup'),
                  NavigationDestination(icon: Icon(Icons.emoji_events_outlined), label: 'Rewards'),
                ],
              ),
      );
    });
  }
}

class _SideNavigation extends StatelessWidget {
  final int selected;
  final ValueChanged<int> onSelect;
  const _SideNavigation({required this.selected, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    const labels = ['Dashboard', 'Register e-waste', 'Pickup requests', 'Eco rewards'];
    const icons = [Icons.grid_view_rounded, Icons.add_box_outlined, Icons.local_shipping_outlined, Icons.emoji_events_outlined];
    return Container(
      width: 245,
      color: const Color(0xFF123F30),
      padding: const EdgeInsets.fromLTRB(16, 26, 16, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(12, 0, 0, 34),
            child: Row(children: [
              Icon(Icons.eco_rounded, color: Color(0xFF9FE0B8), size: 31),
              SizedBox(width: 10),
              Text('EcoCycle', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 22)),
            ]),
          ),
          const Padding(
            padding: EdgeInsets.only(left: 12, bottom: 12),
            child: Text('WORKSPACE', style: TextStyle(color: Color(0xFF9AB8A8), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
          ),
          for (int i = 0; i < labels.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 7),
              child: InkWell(
                borderRadius: BorderRadius.circular(13),
                onTap: () => onSelect(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                  decoration: BoxDecoration(
                    color: selected == i ? const Color(0xFF28694F) : Colors.transparent,
                    borderRadius: BorderRadius.circular(13),
                  ),
                  child: Row(children: [
                    Icon(icons[i], color: selected == i ? Colors.white : const Color(0xFFB4CCBF), size: 21),
                    const SizedBox(width: 12),
                    Expanded(child: Text(labels[i], style: TextStyle(color: selected == i ? Colors.white : const Color(0xFFD0E0D6), fontWeight: selected == i ? FontWeight.w700 : FontWeight.w500))),
                  ]),
                ),
              ),
            ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(color: const Color(0xFF1D523E), borderRadius: BorderRadius.circular(16)),
            child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Icon(Icons.spa_outlined, color: Color(0xFF9FE0B8), size: 25),
              SizedBox(height: 10),
              Text('Small actions,', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              Text('greener future.', style: TextStyle(color: Color(0xFFB8D8C5))),
            ]),
          ),
        ],
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  final List<Map<String, dynamic>> items;
  final List<Map<String, dynamic>> requests;
  final int points;
  final bool backendOnline;
  final bool checkingBackend;
  final ValueChanged<int> onNavigate;
  const DashboardPage({super.key, required this.items, required this.requests, required this.points, required this.backendOnline, required this.checkingBackend, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 26, 24, 30),
      children: [
        const Text('Good for the planet. Great for tomorrow.', style: TextStyle(fontSize: 13, color: green, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        const Text('E-Waste Dashboard', style: TextStyle(fontSize: 29, fontWeight: FontWeight.w800, color: ink)),
        const SizedBox(height: 8),
        const Text('Give old electronics a responsible second life.', style: TextStyle(color: muted, fontSize: 15)),
        const SizedBox(height: 22),
        _HeroCard(onRegister: () => onNavigate(1), onPickup: () => onNavigate(2)),
        const SizedBox(height: 22),
        Wrap(spacing: 12, runSpacing: 12, children: [
          _StatCard(title: 'Items registered', value: '${items.length}', icon: Icons.devices_other_rounded, tint: const Color(0xFFE5F2EA)),
          _StatCard(title: 'Pickup requests', value: '${requests.length}', icon: Icons.local_shipping_outlined, tint: const Color(0xFFE8EEFA)),
          _StatCard(title: 'Eco points', value: '$points', icon: Icons.stars_rounded, tint: const Color(0xFFFFF1D7)),
        ]),
        const SizedBox(height: 22),
        Container(
          padding: const EdgeInsets.all(19),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE7ECE8))),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Expanded(child: Text('Recent activity', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: ink))),
              Text('${items.length + requests.length} records', style: const TextStyle(color: muted, fontSize: 12)),
            ]),
            const SizedBox(height: 14),
            if (items.isEmpty && requests.isEmpty)
              const _EmptyState(icon: Icons.eco_outlined, title: 'Your impact starts here', subtitle: 'Register an old device or schedule your first pickup.')
            else ...[
              for (final item in items.take(3))
                _ActivityRow(icon: Icons.devices_other, title: '${item['type'] ?? 'E-waste'} registered', subtitle: '${item['brand'] ?? item['category'] ?? 'Electronic item'} • ${item['weight'] ?? 0} kg', status: 'Added'),
              for (final request in requests.take(3))
                _ActivityRow(icon: Icons.local_shipping_outlined, title: 'Pickup requested', subtitle: '${request['date'] ?? ''} • ${request['time'] ?? ''}', status: 'Pending'),
            ],
          ]),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(color: backendOnline ? mint : const Color(0xFFFFF4DE), borderRadius: BorderRadius.circular(14)),
          child: Row(children: [
            Icon(backendOnline ? Icons.cloud_done_outlined : Icons.cloud_off_outlined, color: backendOnline ? green : const Color(0xFF9A6715)),
            const SizedBox(width: 10),
            Expanded(child: Text(checkingBackend ? 'Checking C++ backend connection…' : backendOnline ? 'Connected to the C++ backend' : 'Preview mode: C++ backend not detected. Data is temporary.', style: TextStyle(color: backendOnline ? green : const Color(0xFF805717), fontWeight: FontWeight.w600, fontSize: 12))),
          ]),
        ),
      ],
    );
  }
}

class _HeroCard extends StatelessWidget {
  final VoidCallback onRegister;
  final VoidCallback onPickup;
  const _HeroCard({required this.onRegister, required this.onPickup});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(23),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(colors: [Color(0xFF14563D), Color(0xFF25815B)], begin: Alignment.topLeft, end: Alignment.bottomRight),
      ),
      child: LayoutBuilder(builder: (context, constraints) {
        final narrow = constraints.maxWidth < 480;
        final content = Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: Colors.white.withValues(alpha: .15), borderRadius: BorderRadius.circular(30)), child: const Text('♻  RECYCLE RESPONSIBLY', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1))),
          const SizedBox(height: 16),
          const Text('Your old tech\ncan do more.', style: TextStyle(color: Colors.white, fontSize: 27, height: 1.12, fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          const Text('Register unused electronics and arrange a responsible pickup in a few simple steps.', style: TextStyle(color: Color(0xFFD9F0E2), height: 1.45)),
          const SizedBox(height: 19),
          Wrap(spacing: 10, runSpacing: 10, children: [
            FilledButton.icon(onPressed: onRegister, style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: green), icon: const Icon(Icons.add, size: 18), label: const Text('Register item')),
            OutlinedButton.icon(onPressed: onPickup, style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Color(0x99FFFFFF))), icon: const Icon(Icons.calendar_month_outlined, size: 18), label: const Text('Book pickup')),
          ]),
        ]);
        return Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
          Expanded(child: content),
          if (!narrow) const SizedBox(width: 12),
          if (!narrow) const Icon(Icons.recycling_rounded, size: 104, color: Color(0x55FFFFFF)),
        ]);
      }),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color tint;
  const _StatCard({required this.title, required this.value, required this.icon, required this.tint});
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 210,
      child: Container(
        padding: const EdgeInsets.all(17),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE7ECE8))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(width: 42, height: 42, decoration: BoxDecoration(color: tint, borderRadius: BorderRadius.circular(13)), child: Icon(icon, color: green)),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(fontSize: 27, fontWeight: FontWeight.w800, color: ink)),
          const SizedBox(height: 3),
          Text(title, style: const TextStyle(color: muted, fontSize: 12)),
        ]),
      ),
    );
  }
}

class RegisterItemPage extends StatefulWidget {
  final ValueChanged<Map<String, dynamic>> onSubmit;
  const RegisterItemPage({super.key, required this.onSubmit});
  @override
  State<RegisterItemPage> createState() => _RegisterItemPageState();
}

class _RegisterItemPageState extends State<RegisterItemPage> {
  final formKey = GlobalKey<FormState>();
  final idController = TextEditingController();
  final descriptionController = TextEditingController();
  final weightController = TextEditingController();
  final brandController = TextEditingController();
  final modelController = TextEditingController();
  final storageController = TextEditingController();
  final ramController = TextEditingController();
  final osController = TextEditingController();
  final batteryTypeController = TextEditingController();
  final capacityController = TextEditingController();
  String type = 'Phone';
  String category = 'Mobile';

  @override
  void dispose() {
    for (final c in [idController, descriptionController, weightController, brandController, modelController, storageController, ramController, osController, batteryTypeController, capacityController]) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isBattery = type == 'Battery';
    final isLaptop = type == 'Laptop';
    return ListView(padding: const EdgeInsets.all(24), children: [
      const Text('CONTRIBUTE TO A CLEANER PLANET', style: TextStyle(color: green, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1)),
      const SizedBox(height: 8),
      const Text('Register e-waste', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: ink)),
      const SizedBox(height: 8),
      const Text('Tell us a little about the electronic item you want to recycle.', style: TextStyle(color: muted)),
      const SizedBox(height: 22),
      _FormCard(child: Form(
        key: formKey,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const _SectionHeading(title: 'Item details', subtitle: 'Fields marked required must be completed.'),
          const SizedBox(height: 18),
          _FieldLabel('Item ID'),
          TextFormField(controller: idController, decoration: const InputDecoration(hintText: 'e.g. E001'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter an item ID' : null),
          const SizedBox(height: 15),
          _FieldLabel('Device type'),
          DropdownButtonFormField<String>(value: type, decoration: const InputDecoration(), items: const [
            DropdownMenuItem(value: 'Phone', child: Text('Phone')),
            DropdownMenuItem(value: 'SmartPhone', child: Text('Smartphone')),
            DropdownMenuItem(value: 'Laptop', child: Text('Laptop')),
            DropdownMenuItem(value: 'Battery', child: Text('Battery')),
          ], onChanged: (v) => setState(() { type = v!; category = type == 'Laptop' ? 'Computer' : type == 'Battery' ? 'Battery' : 'Mobile'; })),
          const SizedBox(height: 15),
          _FieldLabel('Category'),
          DropdownButtonFormField<String>(value: category, decoration: const InputDecoration(), items: const [
            DropdownMenuItem(value: 'Mobile', child: Text('Mobile')),
            DropdownMenuItem(value: 'Computer', child: Text('Computer')),
            DropdownMenuItem(value: 'Battery', child: Text('Battery')),
            DropdownMenuItem(value: 'Accessory', child: Text('Accessory')),
          ], onChanged: (v) => setState(() => category = v!)),
          const SizedBox(height: 15),
          _FieldLabel('Weight (kg)'),
          TextFormField(controller: weightController, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(hintText: 'e.g. 0.5'), validator: (v) { final n = double.tryParse(v ?? ''); return n == null || n <= 0 ? 'Enter a weight greater than zero' : null; }),
          const SizedBox(height: 15),
          if (!isBattery) ...[
            _FieldLabel('Brand'),
            TextFormField(controller: brandController, decoration: const InputDecoration(hintText: 'e.g. Samsung'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter a brand' : null),
            const SizedBox(height: 15),
            _FieldLabel('Model'),
            TextFormField(controller: modelController, decoration: const InputDecoration(hintText: 'e.g. Galaxy S21'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter a model' : null),
            const SizedBox(height: 15),
          ],
          if (isLaptop) ...[
            _FieldLabel('RAM (GB)'),
            TextFormField(controller: ramController, keyboardType: TextInputType.number, decoration: const InputDecoration(hintText: 'e.g. 8')),
            const SizedBox(height: 15),
          ] else if (!isBattery) ...[
            _FieldLabel('Storage (GB)'),
            TextFormField(controller: storageController, keyboardType: TextInputType.number, decoration: const InputDecoration(hintText: 'e.g. 128')),
            if (type == 'SmartPhone') ...[
              const SizedBox(height: 15),
              _FieldLabel('Operating system'),
              TextFormField(controller: osController, decoration: const InputDecoration(hintText: 'e.g. Android')),
            ],
            const SizedBox(height: 15),
          ],
          if (isBattery) ...[
            _FieldLabel('Battery type'),
            TextFormField(controller: batteryTypeController, decoration: const InputDecoration(hintText: 'e.g. Lithium-ion'), validator: (v) => v == null || v.trim().isEmpty ? 'Enter battery type' : null),
            const SizedBox(height: 15),
            _FieldLabel('Capacity (mAh)'),
            TextFormField(controller: capacityController, keyboardType: TextInputType.number, decoration: const InputDecoration(hintText: 'e.g. 4000')),
            const SizedBox(height: 15),
          ],
          _FieldLabel('Description'),
          TextFormField(controller: descriptionController, minLines: 3, maxLines: 4, decoration: const InputDecoration(hintText: 'Describe the condition of the item')),
          const SizedBox(height: 22),
          SizedBox(width: double.infinity, child: FilledButton.icon(
            onPressed: () {
              if (!formKey.currentState!.validate()) return;
              final data = <String, dynamic>{
                'id': idController.text.trim(),
                'type': type,
                'category': category,
                'description': descriptionController.text.trim(),
                'weight': double.parse(weightController.text),
              };
              if (!isBattery) {
                data['brand'] = brandController.text.trim();
                data['model'] = modelController.text.trim();
                if (storageController.text.isNotEmpty) data['storage'] = int.tryParse(storageController.text);
                if (ramController.text.isNotEmpty) data['ram'] = int.tryParse(ramController.text);
                if (type == 'SmartPhone') data['operatingSystem'] = osController.text.trim();
              } else {
                data['batteryType'] = batteryTypeController.text.trim();
                data['capacity'] = double.tryParse(capacityController.text) ?? 0;
              }
              widget.onSubmit(data);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Item added to the current session.')));
              formKey.currentState!.reset();
              for (final c in [idController, descriptionController, weightController, brandController, modelController, storageController, ramController, osController, batteryTypeController, capacityController]) { c.clear(); }
            },
            icon: const Icon(Icons.check_circle_outline), label: const Text('Register item'),
          )),
        ]),
      )),
    ]);
  }
}

class PickupPage extends StatefulWidget {
  final ValueChanged<Map<String, dynamic>> onSubmit;
  const PickupPage({super.key, required this.onSubmit});
  @override
  State<PickupPage> createState() => _PickupPageState();
}

class _PickupPageState extends State<PickupPage> {
  final formKey = GlobalKey<FormState>();
  final addressController = TextEditingController();
  DateTime? date;
  String time = '10:00 AM';
  @override
  void dispose() { addressController.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(24), children: [
      const Text('CONVENIENT COLLECTION', style: TextStyle(color: green, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1)),
      const SizedBox(height: 8),
      const Text('Schedule a pickup', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: ink)),
      const SizedBox(height: 8),
      const Text('Choose a preferred date and time for collection.', style: TextStyle(color: muted)),
      const SizedBox(height: 22),
      _FormCard(child: Form(key: formKey, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const _SectionHeading(title: 'Pickup information', subtitle: 'Make sure the address is complete.'),
        const SizedBox(height: 18),
        _FieldLabel('Pickup address'),
        TextFormField(controller: addressController, minLines: 2, maxLines: 3, decoration: const InputDecoration(hintText: 'House / building, street, city, PIN code'), validator: (v) => v == null || v.trim().length < 8 ? 'Enter a complete pickup address' : null),
        const SizedBox(height: 18),
        _FieldLabel('Preferred date'),
        OutlinedButton.icon(
          style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 52), alignment: Alignment.centerLeft, foregroundColor: ink, side: const BorderSide(color: Color(0xFFE0E7E2))),
          onPressed: () async {
            final picked = await showDatePicker(context: context, initialDate: DateTime.now().add(const Duration(days: 1)), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 180)));
            if (picked != null) setState(() => date = picked);
          },
          icon: const Icon(Icons.calendar_month_outlined, color: green),
          label: Text(date == null ? 'Select a date' : '${date!.day.toString().padLeft(2, '0')}/${date!.month.toString().padLeft(2, '0')}/${date!.year}'),
        ),
        const SizedBox(height: 18),
        _FieldLabel('Preferred time'),
        DropdownButtonFormField<String>(value: time, decoration: const InputDecoration(), items: const [
          DropdownMenuItem(value: '10:00 AM', child: Text('10:00 AM')),
          DropdownMenuItem(value: '12:00 PM', child: Text('12:00 PM')),
          DropdownMenuItem(value: '02:00 PM', child: Text('02:00 PM')),
          DropdownMenuItem(value: '04:00 PM', child: Text('04:00 PM')),
        ], onChanged: (v) => setState(() => time = v!)),
        const SizedBox(height: 22),
        SizedBox(width: double.infinity, child: FilledButton.icon(onPressed: () {
          if (!formKey.currentState!.validate()) return;
          if (date == null) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a pickup date.')));
            return;
          }
          widget.onSubmit({
            'address': addressController.text.trim(),
            'date': '${date!.year}-${date!.month.toString().padLeft(2, '0')}-${date!.day.toString().padLeft(2, '0')}',
            'time': time,
            'status': 'Pending',
          });
          addressController.clear();
          setState(() => date = null);
        }, icon: const Icon(Icons.local_shipping_outlined), label: const Text('Request pickup'))),
      ]))),
    ]);
  }
}

class RewardsPage extends StatelessWidget {
  final int points;
  final List<Map<String, dynamic>> items;
  const RewardsPage({super.key, required this.points, required this.items});
  @override
  Widget build(BuildContext context) {
    final totalWeight = items.fold<double>(0, (sum, item) => sum + ((item['weight'] as num?)?.toDouble() ?? 0));
    return ListView(padding: const EdgeInsets.all(24), children: [
      const Text('YOUR POSITIVE IMPACT', style: TextStyle(color: green, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1)),
      const SizedBox(height: 8),
      const Text('Eco rewards', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: ink)),
      const SizedBox(height: 8),
      const Text('Every responsible choice counts.', style: TextStyle(color: muted)),
      const SizedBox(height: 22),
      Container(padding: const EdgeInsets.all(25), decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF14563D), Color(0xFF25815B)]), borderRadius: BorderRadius.circular(24)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Icon(Icons.emoji_events_rounded, color: Color(0xFFFFD77A), size: 42),
        const SizedBox(height: 16),
        const Text('YOUR ECO BALANCE', style: TextStyle(color: Color(0xFFD9F0E2), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
        const SizedBox(height: 5),
        Text('$points points', style: const TextStyle(color: Colors.white, fontSize: 34, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        const Text('Preview calculation: approximately 10 points per kg. Final reward logic should be calculated and validated by the C++ backend.', style: TextStyle(color: Color(0xFFD9F0E2), height: 1.4)),
      ])),
      const SizedBox(height: 16),
      Row(children: [
        Expanded(child: _RewardMetric(title: 'Registered weight', value: '${totalWeight.toStringAsFixed(1)} kg', icon: Icons.scale_outlined)),
        const SizedBox(width: 12),
        Expanded(child: _RewardMetric(title: 'Items registered', value: '${items.length}', icon: Icons.devices_other_outlined)),
      ]),
      const SizedBox(height: 18),
      const _EmptyState(icon: Icons.volunteer_activism_outlined, title: 'Keep making a difference', subtitle: 'Register e-waste to track your contribution here.'),
    ]);
  }
}

class _RewardMetric extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  const _RewardMetric({required this.title, required this.value, required this.icon});
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(17), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE7ECE8))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Icon(icon, color: green),
    const SizedBox(height: 14),
    Text(value, style: const TextStyle(fontSize: 23, fontWeight: FontWeight.w800, color: ink)),
    const SizedBox(height: 4),
    Text(title, style: const TextStyle(color: muted, fontSize: 12)),
  ]));
}

class _FormCard extends StatelessWidget {
  final Widget child;
  const _FormCard({required this.child});
  @override
  Widget build(BuildContext context) => Container(
    constraints: const BoxConstraints(maxWidth: 760),
    padding: const EdgeInsets.all(22),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(22), border: Border.all(color: const Color(0xFFE7ECE8))),
    child: child,
  );
}

class _SectionHeading extends StatelessWidget {
  final String title;
  final String subtitle;
  const _SectionHeading({required this.title, required this.subtitle});
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: ink)),
    const SizedBox(height: 4),
    Text(subtitle, style: const TextStyle(color: muted, fontSize: 12)),
  ]);
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 7), child: Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: ink)));
}

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  const _EmptyState({required this.icon, required this.title, required this.subtitle});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.symmetric(vertical: 22), child: Column(children: [
    Container(width: 54, height: 54, decoration: const BoxDecoration(color: mint, shape: BoxShape.circle), child: Icon(icon, color: green, size: 26)),
    const SizedBox(height: 12),
    Text(title, style: const TextStyle(fontWeight: FontWeight.w800, color: ink)),
    const SizedBox(height: 5),
    Text(subtitle, textAlign: TextAlign.center, style: const TextStyle(color: muted, fontSize: 13, height: 1.4)),
  ]));
}

class _ActivityRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String status;
  const _ActivityRow({required this.icon, required this.title, required this.subtitle, required this.status});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(top: 10), child: Row(children: [
    Container(width: 42, height: 42, decoration: BoxDecoration(color: mint, borderRadius: BorderRadius.circular(13)), child: Icon(icon, color: green)),
    const SizedBox(width: 12),
    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(fontWeight: FontWeight.w700, color: ink)),
      const SizedBox(height: 3),
      Text(subtitle, style: const TextStyle(fontSize: 12, color: muted), maxLines: 1, overflow: TextOverflow.ellipsis),
    ])),
    Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5), decoration: BoxDecoration(color: mint, borderRadius: BorderRadius.circular(20)), child: Text(status, style: const TextStyle(color: green, fontWeight: FontWeight.w700, fontSize: 11))),
  ]));
}

class _BackendBadge extends StatelessWidget {
  final bool online;
  final bool checking;
  const _BackendBadge({required this.online, required this.checking});
  @override
  Widget build(BuildContext context) {
    final color = checking ? const Color(0xFFB78125) : online ? green : const Color(0xFF9A6715);
    final label = checking ? 'Checking API' : online ? 'Backend connected' : 'Backend offline';
    return Container(padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 8), decoration: BoxDecoration(color: online ? mint : const Color(0xFFFFF4DE), borderRadius: BorderRadius.circular(25)), child: Row(mainAxisSize: MainAxisSize.min, children: [
      Container(width: 7, height: 7, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 7),
      Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w700)),
    ]));
  }
}
