name: ✨ Feature Request
description: Suggest a new feature
labels: ["✨ enhancement"]
body:
  - type: textarea
    id: idea
    attributes:
      label: 📄 Idea
      description: Describe the feature.
    validations:
      required: true

  - type: textarea
    id: why
    attributes:
      label: ✒️ Why it's useful
      description: Explain the value.
    validations:
      required: true

  - type: textarea
    id: mockup
    attributes:
      label: 🖼️ Mockup / reference (optional)
      description: Screenshot, sketch, or link to something similar elsewhere.
    validations:
      required: false

  - type: textarea
    id: alternatives
    attributes:
      label: ⚖️ Alternatives considered (optional)
    validations:
      required: false

  - type: checkboxes
    id: checklist
    attributes:
      label: ✅ Checklist
      options:
        - label: I searched existing issues to avoid duplicates
          required: true
        - label: I'm using the latest version of ChromaShift
          required: true
