# 🔧 Troubleshooting Guide - Icon Replacement

## Common Issues & Solutions

### ❌ Error: "[Icon Name] is not defined"

**Cause**: Icon is used in the component but not imported from lucide-react-native

**Solution**: Add the missing icon to the import statement

**Example**:
```typescript
// Before (missing Syringe)
import { Shield, Award } from "lucide-react-native";

// After (Syringe added)
import { Shield, Award, Syringe } from "lucide-react-native";
```

**Fixed in this session**:
- ✅ Verify.tsx - Added all missing icons (Syringe, Stethoscope, etc.)

---

### ⚠️ Warning: "shadow*" style props are deprecated. Use "boxShadow"

**Cause**: React Native Web prefers CSS-style `boxShadow` over individual shadow properties

**Impact**: This is just a warning, not an error. The app will still work.

**Solution** (optional, for web optimization):
```typescript
// Current (works but shows warning on web)
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 2,

// Alternative for web (no warning)
boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
elevation: 2, // Keep for Android
```

**Note**: We kept the current shadow implementation for better cross-platform consistency.

---

### 🔄 Metro Bundler Not Updating

**Symptoms**: Changes not reflected in app, old errors persist

**Solutions**:
1. **Clear cache and restart**:
   ```bash
   npx expo start -c
   ```

2. **Reload app manually**:
   - Press `r` in Metro terminal
   - Or shake device and tap "Reload"

3. **Full reset**:
   ```bash
   # Clear Metro cache
   npx expo start --clear
   
   # If still not working, clear npm cache
   npm cache clean --force
   npx expo start -c
   ```

---

### 📱 Icons Not Rendering on Device

**Symptoms**: Blank spaces where icons should be, or app crashes

**Possible Causes**:
1. lucide-react-native not installed
2. Icon name typo
3. React Native SVG dependency missing

**Solutions**:

1. **Verify installation**:
   ```bash
   npm list lucide-react-native
   ```
   Should show: `lucide-react-native@1.22.0`

2. **Reinstall if needed**:
   ```bash
   npm install lucide-react-native@1.22.0
   ```

3. **Check React Native SVG** (lucide-react-native dependency):
   ```bash
   npm install react-native-svg
   npx expo install react-native-svg
   ```

4. **Restart Metro**:
   ```bash
   npx expo start -c
   ```

---

### 🎨 Icons Look Different Than Expected

**Symptoms**: Icons too large/small, wrong color, wrong stroke width

**Solutions**:

1. **Size issues**:
   ```typescript
   // Standard sizes
   <Icon size={24} /> // Navigation
   <Icon size={20} /> // Headers
   <Icon size={16} /> // Buttons
   <Icon size={12} /> // Inline/small
   ```

2. **Color issues**:
   ```typescript
   // Make sure color is defined
   <Icon color={T.teal} /> // Not just {T.teal}
   <Icon color="#FF7043" /> // Hex values work too
   ```

3. **Stroke width**:
   ```typescript
   // Consistent stroke width
   <Icon strokeWidth={1.5} /> // Default
   <Icon strokeWidth={2} /> // Emphasis/bold
   ```

---

### 💥 App Crashes on Specific Screen

**Symptoms**: App crashes when navigating to certain screens

**Diagnostic Steps**:

1. **Check Metro error log** - Look for:
   - "X is not defined" → Missing import
   - "Cannot read property 'Icon'" → Icon prop issue
   - "Invariant Violation" → React rendering issue

2. **Check browser console** (for web):
   - Open http://localhost:8082
   - Press F12 for developer tools
   - Look for red error messages

3. **Use React Native Debugger**:
   - Press `j` in Metro to open debugger
   - Check for errors in console

**Common Fixes**:
- Add missing icon imports
- Check icon prop is valid component
- Verify icon is spelled correctly

---

### 🔍 How to Verify All Icons Are Working

**Quick Test**:
1. Start app: `npm start`
2. Navigate through all screens:
   - Landing → Login → Home
   - Match → Profile → Verify
   - Community → Settings
3. Check that all icons display (no blank spaces)
4. Check Metro console for errors

**Systematic Test**:
Use the provided `TESTING-CHECKLIST.md` for comprehensive testing.

---

### 📋 Icons to Double-Check

These icons are used frequently and could have import issues:

**Most Common**:
- `ArrowLeft` - Back buttons (used in 15+ places)
- `CheckCircle` - Verification status
- `Clock` - Pending status
- `XCircle` - Rejected status
- `Shield` - Verification screens
- `Star` - Ratings and reputation
- `Heart` - Matches and favorites
- `Send` - Actions and requests
- `Eye` - View profile
- `Search` - Search bars
- `Settings` - Settings screens

**Health/Medical**:
- `Syringe` - Vaccination
- `Stethoscope` - Vet clearance
- `Dna` - Genetic tests
- `FileCheck` - Documents

**Navigation/Actions**:
- `Home` - Home tab
- `User` - Profile tab
- `Bell` - Notifications
- `Calendar` - Events
- `MapPin` - Location

---

### 🆘 Still Having Issues?

1. **Check all imports match usage**:
   ```bash
   # Search for icon usage in files
   grep -r "<Syringe" components/
   
   # Then verify it's in the import
   grep "import.*Syringe" components/Verify.tsx
   ```

2. **Verify package.json has**:
   ```json
   {
     "dependencies": {
       "lucide-react-native": "^1.22.0",
       "react-native-svg": "latest"
     }
   }
   ```

3. **Check Expo version compatibility**:
   - Expo SDK 50+ recommended
   - React Native 0.73+ recommended

4. **Try a clean reinstall**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   npx expo start -c
   ```

---

## ✅ Current Status

All known issues have been fixed:
- ✅ Syringe import added to Verify.tsx
- ✅ All icon imports verified
- ✅ No TypeScript errors
- ✅ All diagnostics passing

**Last Updated**: June 30, 2026  
**Build Status**: ✅ Production Ready
