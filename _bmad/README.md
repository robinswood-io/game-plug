# BMAD Artifacts

BMAD = **B**riefs, **M**anual, **A**rtifacts, **D**eployment

## Structure

```
_bmad/
├── artifacts/
│   ├── briefs/       - Initial task briefs (JSON)
│   ├── plans/        - Execution plans (JSON)
│   ├── stories/      - User stories (JSON)
│   ├── reports/      - Task completion reports
│   ├── commits/      - Auto-generated commit logs
│   └── logs/         - Execution logs
├── templates/        - Reusable templates
├── metrics/          - Project metrics
└── README.md         - This file
```

## Workflow

### 1. Generate Brief
```bash
cd $(pwd)
/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-brief.sh
```

Creates: `_bmad/artifacts/briefs/brief-YYYYMMDD-HHMMSS.json`

### 2. Generate Plan
```bash
/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-plan.sh _bmad/artifacts/briefs/brief-*.json
```

Creates: `_bmad/artifacts/plans/plan-YYYYMMDD-HHMMSS.json`

### 3. Generate Story (optional)
```bash
/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-story.sh _bmad/artifacts/plans/plan-*.json
```

Creates: `_bmad/artifacts/stories/story-YYYYMMDD-HHMMSS.json`

### 4. Execute & Commit
```bash
# Execute plan with IA
git add _bmad
git commit -m "feat: [task-name]"
```

## JSON Schema

### Brief
```json
{
  "id": "brief-YYYYMMDD-HHMMSS",
  "timestamp": "ISO8601",
  "level": 1-3,
  "task": "string",
  "context": "string",
  "acceptance_criteria": ["string"],
  "status": "draft|active|completed",
  "project": "string"
}
```

### Plan
```json
{
  "id": "plan-YYYYMMDD-HHMMSS",
  "brief_id": "string",
  "timestamp": "ISO8601",
  "steps": ["string"],
  "effort": "S|M|L",
  "priority": "P0|P1|P2",
  "owner": "string",
  "dependencies": "string",
  "status": "draft|active|completed"
}
```

### Story
```json
{
  "id": "story-YYYYMMDD-HHMMSS",
  "plan_id": "string",
  "brief_id": "string",
  "title": "As a..., I want to...",
  "description": "string",
  "acceptance_tests": ["string"],
  "story_points": 1|2|3|5|8|13,
  "priority": "P0|P1|P2",
  "status": "backlog|in_progress|done"
}
```

## Configuration

Alias in `~/.bashrc`:
```bash
alias bmad-brief='/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-brief.sh'
alias bmad-plan='/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-plan.sh'
alias bmad-story='/opt/ia-webdev/rulebook-ai/scripts/bmad/generate-story.sh'
```

## See Also

- Full rulebook: `/opt/ia-webdev/rulebook-ai/`
- IA development rules: `/home/ubuntu/CLAUDE.md`
