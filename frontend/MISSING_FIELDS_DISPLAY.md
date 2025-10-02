# Missing Fields Display Enhancement

## Overview
Enhanced the validation alert to show **exactly which questions** are not filled, instead of a generic message.

## Changes Made

### Before
```
❌ Formulaire incomplet
Veuillez répondre à toutes les questions avant de continuer.
```

### After
```
❌ Formulaire incomplet
Veuillez répondre aux questions suivantes :

1. Quel est votre âge ?
2. Dans quelle zone habitez-vous ?
3. Quel est votre niveau d'étude ?
```

## Implementation Details

### 1. **Question Database** (Stepper.jsx)
Added complete list of all questions for each step:

```javascript
const stepQuestions = [
  // CC - Connaissance Client (5 questions)
  [
    "Quel est votre sexe ?",
    "Quel est votre âge ?",
    "Quelle est votre situation familiale ?",
    "Dans quelle zone habitez-vous ?",
    "Quel est votre niveau d'étude ?"
  ],
  // PE - Profil Épargnant (5 questions)
  [
    "Quelle méthode utilisez-vous pour épargner ?",
    "À quelle fréquence épargnez-vous ?",
    "Pour quels objectifs épargnez-vous ?",
    "Sur quel horizon de temps placez-vous vos priorités ?",
    "Quel est votre niveau d'épargne actuel ?"
  ],
  // PF - Profil Financier (4 questions)
  [...],
  // PI - Profil Investisseur (4 questions)
  [...],
  // ESG - Critères ESG (6 questions)
  [...]
];
```

### 2. **getMissingFields Function**
New function that identifies which questions are unanswered:

```javascript
const getMissingFields = (stepIndex) => {
  const answers = (stepAnswers && stepAnswers[stepIndex]) || [];
  const answeredQuestions = answers
    .filter(a => a && a.q && (Array.isArray(a.answer) ? a.answer.length > 0 : ...))
    .map(a => a.q);
  
  const questions = stepQuestions[stepIndex] || [];
  const missingQuestions = questions.filter(q => {
    // Check if this question has been answered
    return !answeredQuestions.some(aq => 
      aq.includes(q.substring(0, 20)) || q.includes(aq.substring(0, 20))
    );
  });
  
  return missingQuestions;
};
```

### 3. **Enhanced handleNext Function**
```javascript
const handleNext = () => {
  if (!isStepComplete(currentStep)) {
    const missingFields = getMissingFields(currentStep);
    if (missingFields.length > 0) {
      // Show specific missing fields
      const fieldsList = missingFields.map((field, idx) => 
        `${idx + 1}. ${field}`
      ).join('\n');
      showAlert(`Veuillez répondre aux questions suivantes :\n\n${fieldsList}`);
    } else {
      // Fallback generic message
      showAlert('Veuillez répondre à toutes les questions avant de continuer.');
    }
    return;
  }
  // Proceed to next step...
};
```

### 4. **Enhanced Alert Display**
Added `whitespace-pre-line` to preserve line breaks:

```jsx
<p className="text-sm font-light leading-relaxed whitespace-pre-line">
  {alertMsg}
</p>
```

### 5. **Increased Auto-Dismiss Time**
```javascript
showAlert._t = window.setTimeout(() => setAlertMsg(""), 5000); // Was 3000ms
```

Longer timeout (5 seconds) to give users time to read the list of missing fields.

## Files Modified

1. ✅ **Stepper.jsx**
   - Added `stepQuestions` array with all questions
   - Added `getMissingFields()` function
   - Enhanced `handleNext()` to show specific missing fields
   - Updated alert timeout from 3s to 5s
   - Added `whitespace-pre-line` to alert message
   - Passed `getMissingFields` to Navigation component

2. ✅ **navigation-btn.jsx**
   - Receives `getMissingFields` prop
   - Enhanced confirmation validation to show specific missing fields

## User Experience

### Example Scenarios

#### Scenario 1: User skips 2 questions in "Connaissance Client"
```
┌──────────────────────────────────┐
│ ❌ Formulaire incomplet          │
│                                   │
│ Veuillez répondre aux questions   │
│ suivantes :                       │
│                                   │
│ 1. Quel est votre âge ?          │
│ 2. Dans quelle zone habitez-vous ?│
│                                [X]│
└──────────────────────────────────┘
```

#### Scenario 2: User completes all questions
- No alert appears
- Smoothly proceeds to next step

#### Scenario 3: User skips 1 question in ESG
```
┌──────────────────────────────────┐
│ ❌ Formulaire incomplet          │
│                                   │
│ Veuillez répondre aux questions   │
│ suivantes :                       │
│                                   │
│ 1. Social - Question 2           │
│                                [X]│
└──────────────────────────────────┘
```

## Technical Features

### Multi-line Text Support
- Uses `\n` newline characters
- CSS `whitespace-pre-line` preserves formatting
- Numbered list format (1., 2., 3., etc.)

### Question Matching Algorithm
```javascript
// Flexible matching to handle slight variations in question text
!answeredQuestions.some(aq => 
  aq.includes(q.substring(0, 20)) || 
  q.includes(aq.substring(0, 20))
)
```

### Fallback Mechanism
If `getMissingFields` returns empty array but validation fails:
- Shows generic message as fallback
- Ensures user always gets feedback

## Benefits

### ✅ For Users
1. **Clarity**: Know exactly which questions to answer
2. **Efficiency**: No need to scroll through entire form
3. **Focus**: Jump directly to missing fields
4. **Transparency**: See progress at a glance

### ✅ For Developers
1. **Maintainable**: Questions centralized in one array
2. **Flexible**: Easy to add/remove questions
3. **Reusable**: Same logic works for all steps
4. **Debuggable**: Can see exactly what's being validated

## Question Count Per Step

| Step | Name                  | Questions |
|------|-----------------------|-----------|
| 0    | Connaissance Client   | 5         |
| 1    | Profil Épargnant      | 5         |
| 2    | Profil Financier      | 4         |
| 3    | Profil Investisseur   | 4         |
| 4    | Critères ESG          | 6         |

**Total**: 24 questions across all steps

## Alert Behavior

- **Position**: Top-right corner
- **Animation**: Slide in from right
- **Auto-dismiss**: 5 seconds (increased from 3 seconds)
- **Manual close**: X button
- **Format**: Numbered list with line breaks
- **Max width**: 448px (max-w-md)

## Testing Checklist

- [ ] Skip 1 question → Shows that specific question
- [ ] Skip 2 questions → Shows both questions numbered
- [ ] Skip all questions → Shows all questions
- [ ] Answer all questions → No alert, proceeds smoothly
- [ ] Test on all 5 steps
- [ ] Verify question text matches exactly
- [ ] Check alert auto-dismisses after 5 seconds
- [ ] Verify manual close works
- [ ] Test on mobile and desktop
- [ ] Check line breaks display correctly

## Edge Cases Handled

1. **Empty answers array**: Shows all questions as missing
2. **Partial answers**: Only shows unanswered questions
3. **Array vs String answers**: Handles both checkbox and select/radio
4. **Question text variations**: Flexible matching algorithm
5. **Unknown step index**: Returns empty array (fallback message)

## Future Enhancements

- [ ] Add scroll-to-question functionality when clicking on missing field
- [ ] Highlight missing fields with red border
- [ ] Add question numbers in the form itself
- [ ] Click on missing field in alert to auto-scroll to it
- [ ] Add progress bar showing X/24 questions completed
