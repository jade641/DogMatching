# Icon Reference Guide - Lucide Icons

Quick reference for all icons used in the PawMatch app.

## Navigation Icons (Bottom Tabs - 24px)

| Tab | Icon | Usage |
|-----|------|-------|
| Home | `<Home>` | Main dashboard |
| Match | `<Heart>` | Match discovery |
| Profile | `<User>` | User profile |
| Verify | `<Shield>` | Verification hub |
| Community | `<Star>` | Community features |

## Action Icons

### Primary Actions (16-20px)
- **Send** → `<Send>` - Send requests, messages
- **View** → `<Eye>` - View details
- **Edit** → `<Edit>` - Edit profile/content
- **Search** → `<Search>` - Search functionality
- **Filter** → `<Filter>` / `<Settings>` - Filter/settings
- **Camera** → `<Camera>` - Take photo
- **Upload** → `<Upload>` / `<FolderOpen>` - Upload files
- **Add** → `<Plus>` - Add new item

### Navigation Actions (20px)
- **Back** → `<ArrowLeft>` - Go back
- **Notifications** → `<Bell>` - Notifications (with red dot for unread)
- **Settings** → `<Settings>` - Settings menu
- **Logout** → `<LogOut>` - Sign out

## Status & Verification Icons

### Verification Badges (12-16px inline)
- **Verified** → `<CheckCircle>` (green/teal) - Expert verified
- **Pending** → `<Clock>` (amber) - Under review
- **Rejected** → `<XCircle>` (coral) - Not approved
- **Award** → `<Award>` - Achievement/tier badge

### Health Documents (18-24px)
- **Vaccination** → `<Syringe>` - Vaccination records
- **Vet Cleared** → `<Stethoscope>` - Veterinary clearance
- **Pedigree** → `<FileCheck>` - Pedigree papers
- **DNA Test** → `<Dna>` - Genetic testing
- **General Document** → `<FileText>` - Other documents

## Content Icons

### Dog/Pet Related (20-24px)
- **Dog/Pet** → `<PawPrint>` - Dog profile, pet content
- **Match** → `<Heart>` - Compatibility, matching

### Location & Events (12-16px inline)
- **Location** → `<MapPin>` - Location marker
- **Calendar** → `<Calendar>` - Events, dates
- **Event Type** → `<PawPrint>`, `<Stethoscope>`, `<Award>`

### Communication (16-20px)
- **Message** → `<MessageSquare>` - Messages, reviews
- **Review/Rating** → `<Star>` - Ratings, reputation

## Feature Section Icons (20-24px)

- **Reputation** → `<Star>` - Reputation system
- **History** → `<FileText>` - Transaction history
- **Badges** → `<Award>` - Achievement badges
- **Privacy** → `<Shield>` - Privacy settings
- **Help** → `<HelpCircle>` - Help & support
- **Info** → `<Info>` - About/information
- **Language** → `<Globe>` - Language settings
- **Payment** → `<CreditCard>` - Payment methods

## Empty State Icons (40-48px)

Large icons in circular containers for empty states:
- **No Matches** → `<PawPrint>` in teal circle
- **No Notifications** → `<Bell>` in gray circle
- **Get Verified** → `<Shield>` in teal circle
- **Browse** → `<Search>` in teal circle

## Icon Sizing Standards

### Component Type → Size
- **Bottom Navigation** → 24px
- **Page Headers** → 18-20px
- **Buttons (Primary)** → 16px
- **Buttons (Secondary)** → 14px
- **Inline (Lists)** → 12-16px
- **Badges** → 12-14px
- **Empty States** → 40-48px
- **Hero/Feature** → 28-32px

## Color Standards

### By State
- **Active/Primary** → `#FF7043` (orange)
- **Inactive** → `#888780` (gray)
- **Success/Verified** → `#FF7043` (teal/orange)
- **Warning/Pending** → `#a06000` (dark amber)
- **Error/Rejected** → `#FF7043` (coral/orange)

### By Background
- **On White** → Use theme colors
- **On Colored BG** → White (#fff)
- **On Light BG** → Darker shade of BG color

## Stroke Width Standards

- **Default** → 1.5px
- **Bold/Emphasis** → 2px
- **Subtle/Inactive** → 1.5px

## Common Icon Combinations

### Buttons
```typescript
// Primary action with icon
<Send size={16} color="#fff" strokeWidth={2} />
<Text>Send Request</Text>

// Secondary action with icon
<Eye size={14} color={T.teal} strokeWidth={2} />
<Text>View Profile</Text>
```

### Status Indicators
```typescript
// Verified
<CheckCircle size={12} color={T.teal} strokeWidth={2} />
<Text>Verified</Text>

// Pending
<Clock size={12} color="#a06000" strokeWidth={2} />
<Text>Pending</Text>
```

### Navigation Headers
```typescript
// Header with icon
<Shield size={18} color={T.dark} strokeWidth={1.5} />
<Text>Verification Status</Text>
```

### Rating Stars
```typescript
// Filled star (active)
<Star size={14} color="#f59e0b" fill="#f59e0b" strokeWidth={1.5} />

// Empty star (inactive)
<Star size={14} color="#d1d5db" strokeWidth={1.5} />
```

## Best Practices

1. **Always include text labels** with icons for clarity
2. **Use consistent sizing** within the same component type
3. **Match stroke width** to visual hierarchy (bolder = more important)
4. **Pair icons with appropriate colors** based on semantic meaning
5. **Add proper spacing** (gap: 4-8px) between icon and text
6. **Use filled variants** for active states (stars, status indicators)
7. **Maintain accessibility** with proper color contrast
8. **Test on multiple screen sizes** to ensure clarity

---

**Library**: lucide-react-native v1.22.0  
**Documentation**: https://lucide.dev/guide/packages/lucide-react-native
