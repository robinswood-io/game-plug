# Quick Start: Character Edit Page

## Access the Page

**URL**: `http://your-domain/gm/{sessionId}/edit-character/{characterId}`

**Example**: `http://localhost:3000/gm/sess_abc123/edit-character/char_xyz789`

## Requirements

- You must be logged in
- You must be the Game Master (GM) of the session
- The character must exist in the database

## File Location

```
/opt/workspace/game-plug/app/app/(authenticated)/gm/[sessionId]/edit-character/[id]/page.tsx
```

## What You Can Edit

### Character Info
- Name
- Occupation (dropdown with 7th edition options)
- Age (15-99 years)
- Gender
- Birthplace
- Residence

### Characteristics (0-100 scale)
- Strength (FOR)
- Constitution (CON)
- Size (TAI)
- Dexterity (DEX)
- Appearance (APP)
- Intelligence (INT)
- Power (POU)
- Education (EDU)
- Luck (CHA)

**Actions**:
- "Roll All" - Generate new random characteristics
- "Recalculate Stats" - Update derived stats based on characteristics

### Health & Resources
- Hit Points (current and max)
- Sanity (current and max)
- Magic Points (current and max)
- Money ($)

### Skills
- 40+ skills with French names
- Edit each skill from 0-100%
- Base values shown for reference
- Sorted alphabetically

### Portrait
- AI-generated portrait display
- Custom description for regeneration
- "Generate Avatar" button to create new portrait

## Buttons & Actions

| Button | Action |
|--------|--------|
| Roll All | Re-roll all characteristics with game mechanics |
| Recalculate Stats | Update HP/Sanity/MP based on current characteristics |
| Generate Avatar | Create AI portrait (optional, requires OpenAI API) |
| Save | Submit form and update character in database |
| Cancel | Return to GM dashboard without saving |
| Return | Go back to dashboard (header button) |

## Form Validation

The form validates:
- **Name**: Minimum 2 characters
- **Occupation**: Required selection
- **Age**: Between 15 and 99
- **Characteristics**: Between 1 and 100
- **Hit Points**: Non-negative, max ≤ maxHitPoints
- **Sanity/Magic**: Similar rules to hit points
- **Skills**: Between 0 and 100
- **Money**: Non-negative decimal number

## Game Mechanics

### Characteristic Rolling (Call of Cthulhu 7e)
- **Standard** (STR, CON, DEX, APP, POW, CHA): 3d6 × 5
- **Advanced** (INT, SIZ, EDU): (2d6 + 6) × 5

### Derived Stats Calculation
- **Hit Points** = (CON + SIZ) / 10
- **Sanity** = POW
- **Magic Points** = POW / 5

## API Calls Made

### On Load
1. `GET /api/sessions/{sessionId}` - Verify GM status
2. `GET /api/characters/{id}` - Load character data

### On Save
1. `PATCH /api/characters/{id}` - Update character

### On Avatar Generation
1. `POST /api/generate-avatar` - Create AI portrait

## Keyboard Shortcuts

- None currently implemented

## Troubleshooting

### "Accès refusé" (Access Denied)
- Verify you are the GM of this session
- Check if you're still logged in

### "Personnage introuvable" (Character Not Found)
- Verify the character ID is correct
- Check if the character exists in the session

### Form Won't Submit
- Check for validation errors (red text under fields)
- Ensure all required fields are filled
- Verify age is between 15-99

### Avatar Generation Fails
- Check if OpenAI API is configured
- Verify API key is valid
- Check browser console for details

### Lost Changes
- The form auto-saves to local state but not to database
- Use Save button to persist changes

## Styling & Theme

The page uses the **Lovecraftian** theme:
- Dark backgrounds (deep-black, cosmic-void)
- Gold accents (aged-gold)
- Burgundy buttons (blood-burgundy)
- Parchment text (aged-parchment)
- Special fonts (Cinzel for headers, Source Sans for body)

## Responsive Design

- **Mobile**: Optimized for small screens, single column
- **Tablet**: 2-column layout for some sections
- **Desktop**: Full 3-column grid for characteristics and skills

## Performance

- Form is optimized with React Hook Form
- TanStack Query handles caching
- Skills render in grid (not virtualized)
- Avatar preview is lazy-loaded
- No unnecessary re-renders

## Security

- ✓ Authentication required (redirect to login if not)
- ✓ Authorization verified (GM only)
- ✓ CSRF protected (credentials included)
- ✓ Input validation on client and server
- ✓ No sensitive data in logs

## Common Tasks

### Roll New Characteristics
1. Click "Roll All" button
2. Review new values
3. Click Save to persist

### Update a Single Skill
1. Find skill in the grid
2. Enter new value (0-100)
3. Click Save

### Add a Portrait
1. Scroll to "Portrait du Personnage" section
2. Optionally add custom description
3. Click "Generate Avatar"
4. Wait for generation
5. Click Save to keep changes

### Reset Derived Stats
1. Adjust characteristics as needed
2. Click "Recalculate Stats"
3. Review new HP/Sanity/MP
4. Click Save

## Mobile Tips

- Use landscape orientation for better form layout
- Tap skill values to edit them quickly
- Use keyboard number pad for faster input
- Swipe to scroll through long skill list

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Tips & Tricks

1. **Bulk Edit Skills**: Use "Recalculate Stats" to quickly update derived stats after characteristic changes
2. **Save Often**: Remember to click Save after making changes
3. **Back Button**: Browser back button works, but may lose form data
4. **Tab Navigation**: Use Tab to move between form fields
5. **Skill Search**: No search feature - skills are sorted alphabetically in French

## Known Limitations

- No undo/redo (refresh page to reset unsaved changes)
- No batch character editing (one at a time)
- No skill templates or presets
- Avatar generation requires API quota
- No character history/changelog

## Related Pages

- **GM Dashboard**: `/gm/{sessionId}` - View all session characters
- **Create Character**: `/gm/{sessionId}/character-creation` - Create new character
- **Character View**: `/character/{id}` - Player view (read-only)

## Need Help?

- Check validation error messages (shown in red)
- Verify API endpoints are responding (browser DevTools)
- Check console for JavaScript errors
- Review the implementation guide: `CHARACTER_EDIT_IMPLEMENTATION.md`

## Last Updated

2025-12-29 - Migration to Next.js 15 complete
