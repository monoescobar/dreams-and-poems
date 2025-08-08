# Dreams and Poems - Local Network Server Setup

## Your Current Setup
- **Local IP Address**: 192.168.86.160
- **Python Server**: Currently running on port 8080

## Access Your Video Player

### From Your Computer:
- http://localhost:8080

### From Other Devices on Your Network:
- http://192.168.86.160:8080

## Server Options

### 1. Python HTTP Server (Currently Running)
```bash
python -m http.server 8080 --bind 0.0.0.0
```
- ✅ Simple and works immediately
- ✅ No installation needed
- ❌ Basic features only

### 2. Node.js Server (Enhanced)
```bash
node server.js
```
- ✅ Better logging and error handling
- ✅ CORS support
- ✅ Custom 404 pages
- ❌ Requires Node.js

### 3. VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click on index.html
3. Select "Open with Live Server"
4. Configure to allow network access

## Firewall Setup (if needed)

### Windows Defender Firewall:
1. Open Windows Security
2. Go to Firewall & network protection
3. Click "Allow an app through firewall"
4. Add Python or Node.js
5. Allow both Private and Public networks

### Alternative - Quick firewall rule:
```cmd
netsh advfirewall firewall add rule name="Dreams and Poems Server" dir=in action=allow protocol=TCP localport=8080
```

## Mobile Access Tips

### For iPhones/iPads:
- Open Safari
- Type: http://192.168.86.160:8080
- Add to Home Screen for app-like experience

### For Android:
- Open Chrome
- Type: http://192.168.86.160:8080
- Menu > Add to Home screen

## Troubleshooting

### Can't connect from other devices?
1. Check firewall settings
2. Ensure devices are on same Wi-Fi network
3. Try disabling firewall temporarily to test
4. Check if antivirus is blocking connections

### Server not starting?
1. Port 8080 might be in use - try port 8081 or 3000
2. Run as administrator if needed
3. Check Windows Defender real-time protection

## Network Security Note
This server is only accessible on your local network (192.168.86.x). 
It's not accessible from the internet, making it safe for home use.
