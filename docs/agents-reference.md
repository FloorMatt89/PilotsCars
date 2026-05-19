# Agent Teams Reference Guide

## Overview

Claude Code supports two agent paradigms: **subagents** and **agent teams**. This guide helps you choose the right approach and design effective multi-agent workflows.

---

## Subagents vs Agent Teams: Quick Comparison

| Aspect | Subagents | Agent Teams |
|--------|-----------|-------------|
| **Context** | Own context window; results return to caller | Own context window; fully independent |
| **Communication** | Report to main agent only | Message each other directly |
| **Coordination** | Main agent manages all work | Shared task list, self-coordination |
| **Best for** | Quick focused tasks with single result | Complex work needing discussion & collaboration |
| **Token cost** | Lower (results summarized back) | Higher (each teammate = full context) |
| **Status** | Stable, enabled by default | Experimental, disabled by default |
| **Nesting** | Cannot spawn other subagents | Cannot spawn other teams |
| **Communication** | Cannot ask you questions directly | Cannot ask you questions directly |

---

## Subagents: Definition & Usage

### When to use subagents

✅ **Use subagents for:**
- Read-only research or exploration
- Single focused tasks where you just need a result
- Verification/testing after implementation
- Quick parallel lookups on independent data
- Delegating from the main session

❌ **Skip subagents if:**
- Agents need to discuss findings with each other
- Work has many dependencies between tasks
- You need shared state or context between workers

### Subagent Structure

Defined in `.claude/agents/` (project) or `~/.claude/agents/` (user):

```markdown
---
name: agent-identifier              # Unique, lowercase + hyphens
description: "When to use this..."  # Drives automatic delegation
tools: Read, Grep, Glob, Bash       # Allowlist (optional, defaults to all)
disallowedTools: Write, Edit        # Denylist (applied after tools)
model: haiku|sonnet|opus|inherit    # Model choice (optional)
permissionMode: default|...         # Permission handling (optional)
maxTurns: 50                        # Max agentic turns (optional)
effort: low|medium|high|xhigh|max   # Override effort level (optional)
isolation: worktree                 # Run in isolated git worktree (optional)
color: red|blue|green|...           # Terminal color (optional)
memory: user|project|local          # Memory directory (optional)
skills:                             # Preload specific skills
  - skill-name-1
  - skill-name-2
mcpServers:                         # MCP servers (optional)
  - server-name
hooks:                              # Lifecycle hooks (optional)
  PreToolUse:
    - matcher: "Bash"
---

# System prompt (markdown body)
You are a specialized agent that...
```

### How subagents are invoked

**Automatic delegation:**
- Claude reads the `description` field and delegates when task matches
- Include "use proactively" in description to encourage auto-delegation

**Explicit invocation:**
- Natural language: "Use the code-reviewer agent to..."
- @-mention: `@"agent-name (agent)" task`
- Session-wide: set `"agent": "agent-name"` in `.claude/settings.json`

### Subagent Scope

- **Project-level**: `.claude/agents/` — shared by team, committed to repo
- **User-level**: `~/.claude/agents/` — personal, all projects
- Built-in agents (Plan, Explore) skip CLAUDE.md for speed

---

## Agent Teams: Coordination & Collaboration

### Enable agent teams

⚠️ **Experimental feature** — disabled by default.

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Requires Claude Code v2.1.32+. Check version: `claude --version`

### When to use agent teams

✅ **Best for:**
- **Research & review**: multiple teammates investigate simultaneously, share findings
- **New modules/features**: each teammate owns separate, independent pieces
- **Competing hypotheses**: teammates test different theories in parallel, debate converges faster
- **Cross-layer coordination**: frontend, backend, tests each owned by a different teammate

❌ **Avoid for:**
- Sequential tasks (single session is more efficient)
- Same-file edits by multiple teammates (causes conflicts)
- Tasks with heavy dependencies between work items

### Architecture

**Team components:**

| Component | Role |
|-----------|------|
| **Team lead** | Main session that creates team, spawns teammates, coordinates |
| **Teammates** | Separate Claude Code instances, each with own context window |
| **Task list** | Shared work items at `~/.claude/tasks/{team-name}/` |
| **Mailbox** | Direct messaging system between agents |
| **Team config** | Runtime state at `~/.claude/teams/{team-name}/config.json` |

Teammates read the `config.json` to discover other team members:

```json
{
  "members": [
    { "name": "researcher", "agentId": "...", "agentType": "researcher" },
    { "name": "implementer", "agentId": "...", "agentType": "implementer" }
  ]
}
```

### Starting a team

**Natural language request:**

```text
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
```

Claude creates the team, spawns teammates, assigns tasks, and coordinates. You stay in control — no team is created without your approval.

### Display Modes

| Mode | Behavior | Requirements |
|------|----------|--------------|
| `in-process` (default) | All teammates in main terminal; use Shift+Down to cycle | Any terminal |
| `split-panes` | Each teammate in separate pane; view all at once | tmux or iTerm2 |
| `auto` | Split panes if in tmux session, in-process otherwise | Varies |

**Set in `~/.claude/settings.json`:**

```json
{
  "teammateMode": "in-process"
}
```

**Or per-session:**

```bash
claude --teammate-mode in-process
```

### Control the team

**Tell the lead (in natural language):**

```text
Spawn a teammate using the security-reviewer agent type
Assign task #3 to the implementer
Have the researcher shut down
Clean up the team
```

**Communicate directly:**

- **In-process**: Shift+Down to cycle, then type to message
- **Split-panes**: click into a teammate's pane to interact
- **Shared task list**: all agents claim work automatically

### Using subagent definitions as teammates

Reference a subagent definition when spawning a teammate:

```text
Spawn a teammate using the qa-web agent type to test the website.
```

The teammate honors the subagent's `tools` allowlist and `model`, and the subagent's system prompt is **appended** to (not replacing) the teammate instructions.

**Note:** `skills` and `mcpServers` fields from subagent definitions are NOT applied to teammates. Teammates load these from settings.json/CLAUDE.md instead.

### Task coordination

Tasks have three states: **pending**, **in progress**, **completed**.

**Dependencies:** A pending task with unresolved dependencies cannot be claimed until those dependencies are completed.

**Assignment:**
- Lead assigns: `"Assign task #5 to the implementer"`
- Self-claim: teammates automatically pick up next unassigned, unblocked task

**Task claiming** uses file locking to prevent race conditions.

### Permissions and context

- **Permissions**: teammates inherit the lead's permission settings; can be changed per-teammate after spawning
- **Context**: teammates load CLAUDE.md, MCP servers, skills, and the spawn prompt (but NOT lead's conversation history)
- **Communication**: messages delivered automatically to recipients; no polling needed
- **Idle notifications**: teammates automatically notify the lead when they stop

### Quality gates with hooks

Enforce rules at critical points:

```json
{
  "hooks": {
    "TeammateIdle": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review task status and decide if work is ready"
          }
        ]
      }
    ],
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm run test -- --changed"
          }
        ]
      }
    ]
  }
}
```

Hook events: `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `SubagentStart`, `SubagentStop`

---

## Best Practices

### Team size

**Recommended: 3-5 teammates** for most workflows.

- Token costs scale linearly with teammates
- Coordination overhead increases with team size
- Diminishing returns beyond 5-6 teammates
- Aim for 5-6 tasks per teammate (keeps everyone productive)

**Scale up only when work genuinely benefits from parallel execution.**

### Task sizing

| Size | Problem | Solution |
|------|---------|----------|
| Too small | Coordination overhead > benefit | Combine into larger units |
| Too large | Teammates work alone too long | Break into 5-6 deliverables per teammate |
| Just right | Self-contained, clear deliverable | Review after initial split |

Examples of good task sizes: a function, a test file, a code review, a research document.

### Context and communication

- **Provide task context in spawn prompt** — teammates don't inherit lead's conversation history
- **Reference shared files** — teammates share your repo; point them to specific locations
- **Use CLAUDE.md for team-wide guidance** — teammates read it automatically
- **Assign teammate names** — use in spawn prompt to reference them later

### Workflow patterns

**Pattern 1: Parallel research + synthesis**

```text
Spawn 3 researchers to investigate different aspects of the problem.
After they finish, synthesize findings into a summary.
```

**Pattern 2: Independent features**

```text
Break the work into 3 features. Spawn a teammate per feature.
Each teammate owns their files completely (no overlaps).
```

**Pattern 3: Competing hypotheses**

```text
Spawn 5 teammates to investigate different root causes.
Have them message each other to challenge theories.
Converge on the most plausible cause.
```

**Pattern 4: Code review by domain**

```text
Spawn reviewers for security, performance, and test coverage.
Each focuses on their domain; lead synthesizes findings.
```

### Avoid common pitfalls

❌ **Don't:**
- Have multiple teammates edit the same file (overwrites result)
- Let teams run unattended (increasing risk of wasted effort)
- Create teams for sequential/dependent tasks (single session is cheaper)
- Spawn a team for work that needs many decision points from you

✅ **Do:**
- Break work so each teammate owns distinct files
- Check in on progress and redirect if needed
- Monitor token usage (scales linearly)
- Start with research/review if new to teams

---

## Token costs

Agent teams use **significantly more tokens** than a single session because:

- Each teammate has its own context window
- Token usage scales linearly with number of active teammates
- Each teammate loads full CLAUDE.md + project context

**Cost calculation:**
- 3 teammates for 30 minutes = ~3x the token cost of one session for 30 minutes
- Plus lead's coordination overhead

Agent teams are worth the cost for:
- Research requiring simultaneous investigation
- New features needing parallel work
- Review tasks with competing perspectives

Not worth the cost for:
- Linear, sequential work
- Routine tasks with few decision points
- Tasks that fit in a single session

---

## Troubleshooting

### Teammates not appearing

- In in-process mode: use Shift+Down to cycle through active teammates
- Task may not be complex enough for Claude to spawn a team (try explicitly requesting teammates)
- For split-panes: check `which tmux` is in PATH
- For iTerm2: verify Python API is enabled in preferences

### Too many permission prompts

Pre-approve common operations in permission settings before spawning teammates.

### Teammates stopping on errors

Teammates may halt after errors. Use Shift+Down to check output, give additional instructions, or spawn a replacement teammate.

### Task completion lag

Teammates sometimes fail to mark tasks as completed. If a task appears stuck:
- Check whether the work is actually done
- Tell the lead to nudge the teammate or update status manually

### Orphaned tmux sessions

If a tmux session persists after team ends:

```bash
tmux ls
tmux kill-session -t <session-name>
```

---

## Known Limitations (Experimental)

⚠️ Agent teams are experimental. Be aware of:

- **No session resumption** with in-process teammates — `/resume` won't restore them
- **Task status can lag** — teammates sometimes fail to mark completion
- **Shutdown can be slow** — teammates finish current work first
- **One team at a time** — lead can only manage one team
- **No nested teams** — teammates cannot spawn their own teams
- **Lead is fixed** — cannot transfer leadership mid-team
- **Split panes** require tmux/iTerm2 (not VS Code terminal, Windows Terminal, Ghostty)

**Good news:** CLAUDE.md works normally. Teammates read it and follow project rules automatically.

---

## Choosing Your Approach

### Use a single session if:
- Work is sequential or has heavy dependencies
- You're making changes to the same files
- Quick task with one clear deliverable
- Token cost is a constraint

### Use subagents if:
- Need quick, focused workers for specific tasks
- Results just need to come back to main session
- Parallel read-only work (research, analysis)
- Want lower token cost
- Verification or testing after implementation

### Use agent teams if:
- Multiple teammates need to collaborate and discuss findings
- Work can be split into independent, parallel pieces
- Competing hypotheses or perspectives add value
- Code review, investigation, or design benefits from parallelism
- Token cost is acceptable trade-off for faster time-to-completion

---

## Next Steps

1. **For your PilotCars project:** Design agent teams for research, web development, mobile development, and QA — each teammate owns distinct layers.
2. **Enable agent teams:** Add `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` to settings.json
3. **Create subagent definitions** for reusable roles (researcher, web-backend, mobile-frontend, etc.)
4. **Plan task breakdown** — aim for 5-6 tasks per teammate, zero file overlaps
5. **Test with a small team** — research + review is a safe starting point
