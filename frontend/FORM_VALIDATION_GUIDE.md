# Form Validation Implementation Guide

## Overview
Comprehensive form validation has been implemented across all profiling steps to ensure users complete all required fields before proceeding.

## Features Implemented

### 1. **Visual Required Field Indicators**
- **Red Asterisk (*)**: Each question label now displays a red asterisk to indicate it's required
- **Info Banner**: Blue informational banner at the top of each form explaining that all questions are mandatory

### 2. **Form Validation**
- **Step-by-Step Validation**: Users cannot proceed to the next step until all questions in the current step are answered
- **Final Confirmation Validation**: Users cannot confirm and submit until all questions in the ESG step are answered
- **Real-time Validation**: Validation occurs when clicking "Suivant" or "Confirmer" buttons

### 3. **User Feedback**
- **Alert Banner**: When validation fails, a prominent red alert appears at the top of the screen
- **Specific Error Messages**: Alert shows which step needs completion (e.g., "Veuillez répondre à toutes les questions de 'Connaissance Client' avant de continuer.")
- **Auto-dismiss**: Alert automatically disappears after 3 seconds
- **Manual Close**: Users can manually close the alert by clicking the X button

## Files Modified

### Form Components (Added Info Banner & Required Indicators)

1. **Cc.jsx** (Connaissance Client)
   - Added blue info banner
   - Added red asterisk to all question labels
   - 5 required questions

2. **Pe.jsx** (Profil Épargnant)
   - Added blue info banner
   - Added red asterisk to all question labels
   - 5 required questions

3. **Pf.jsx** (Profil Financier)
   - Added blue info banner
   - Added red asterisk to all question labels
   - 4 required questions

4. **Pi.jsx** (Profil Investisseur)
   - Added blue info banner
   - Added red asterisk to all question labels
   - 4 required questions
   - Special handling for "Non" option that disables other checkboxes

5. **Esg.jsx** (Critères ESG)
   - Added blue info banner
   - Added red asterisk to all question labels (Q1 and Q2 in each category)
   - 6 required questions (2 per category × 3 categories)

### Validation Logic

6. **Stepper.jsx** (Main Stepper Container)
   - Enhanced validation with step-specific error messages
   - Improved alert banner styling with gradient background
   - Alert shows current step name in error message
   - Passes validation functions to Navigation component

7. **navigation-btn.jsx** (Navigation Buttons)
   - Added validation check before confirming (last step)
   - Validates ESG step completion before allowing confirmation
   - Receives and uses `isStepComplete` and `showAlert` props

## Validation Rules

### Question Count Per Step
```javascript
const requiredCounts = [5, 5, 4, 4, 6];
// Index 0: CC  - 5 questions
// Index 1: PE  - 5 questions
// Index 2: PF  - 4 questions
// Index 3: PI  - 4 questions
// Index 4: ESG - 6 questions
```

### Answer Validation
- **Select/Radio**: Must have a non-empty value
- **Checkbox**: Must have at least one option selected (array length > 0)
- **Text**: Must not be empty or whitespace-only

### Special Cases
- **Pi.jsx "Non" Option**: When selected, automatically deselects all other investment product options
- **"Autres" Input**: When "Autres" checkbox is selected, a text input appears (required)

## User Experience Flow

### Normal Flow
1. User answers all questions in a step
2. Clicks "Suivant"
3. Moves to next step seamlessly
4. Repeats until reaching ESG (last step)
5. Clicks "Confirmer"
6. If all valid, confirmation popup appears

### Error Flow
1. User skips some questions
2. Clicks "Suivant" or "Confirmer"
3. **Alert appears** at top of screen with specific error message
4. User stays on current step
5. User completes missing answers
6. Can now proceed

## Visual Elements

### Info Banner
```jsx
<div className="mb-4 flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
  <svg className="w-5 h-5 text-blue-400">...</svg>
  <div className="text-sm text-blue-200">
    <span className="font-medium">Information importante :</span> 
    Toutes les questions sont obligatoires pour passer à l'étape suivante.
  </div>
</div>
```

### Required Asterisk
```jsx
<label className="flex items-start gap-2">
  <span className="text-red-400 text-lg">*</span>
  <span className="flex-1">{question.question}</span>
</label>
```

### Alert Banner
```jsx
{alertMsg && (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
    <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-500">
      <h3>Formulaire incomplet</h3>
      <p>{alertMsg}</p>
    </div>
  </div>
)}
```

## Error Messages

### Step Navigation Errors
- "⚠️ Veuillez répondre à toutes les questions de 'Connaissance Client' avant de continuer."
- "⚠️ Veuillez répondre à toutes les questions de 'Profil Épargnant' avant de continuer."
- "⚠️ Veuillez répondre à toutes les questions de 'Profil Financier' avant de continuer."
- "⚠️ Veuillez répondre à toutes les questions de 'Profil Investisseur' avant de continuer."
- "⚠️ Veuillez répondre à toutes les questions de 'Critères ESG' avant de continuer."

### Final Confirmation Error
- "⚠️ Veuillez répondre à toutes les questions de 'Critères ESG' avant de confirmer."

## Technical Details

### State Management
- Validation state managed in `Stepper.jsx`
- Alert message stored in `alertMsg` state
- Auto-dismiss timeout managed with `showAlert._t`

### Props Flow
```
Stepper.jsx
  ├─> isStepComplete() function
  ├─> showAlert() function
  └─> Navigation Component
      ├─> receives validation props
      └─> validates before confirm
```

### Animation
- Alert slides down from top using `animate-[slideDown_0.3s_ease-out]`
- Defined in `index.css` with keyframes

## Testing Checklist

- [ ] Try to proceed without answering all questions → Alert appears
- [ ] Answer all questions → Can proceed to next step
- [ ] Try to confirm on ESG step without all answers → Alert appears
- [ ] Complete all ESG questions → Can confirm successfully
- [ ] Click X on alert → Alert closes
- [ ] Wait 3 seconds → Alert auto-closes
- [ ] Check all 5 steps have info banner and asterisks
- [ ] Test "Non" option in Pi.jsx → Other options get disabled

## Accessibility

- Alert has proper ARIA labels
- Close button has `aria-label="Fermer"`
- SVG icons have `aria-hidden="true"`
- Required fields marked with visual indicator (*)
- Info banner uses contrasting colors for readability

## Future Enhancements

- [ ] Field-level validation (highlight specific empty fields)
- [ ] Progress indicator showing completion percentage
- [ ] Save draft functionality
- [ ] Inline error messages under each question
- [ ] Scroll to first empty field on validation error
