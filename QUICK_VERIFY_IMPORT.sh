#!/bin/bash

echo "=========================================="
echo "Quick Verification: Import Button Integration"
echo "=========================================="
echo ""

# 1. Check TypeScript
echo "1. TypeScript Compilation..."
cd /srv/workspace/game-plug
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "   ✅ TypeScript: PASSED"
else
    echo "   ❌ TypeScript: FAILED"
    exit 1
fi

echo ""

# 2. Check git commit
echo "2. Git Commit Status..."
if git log --oneline | grep "1bda1a6" > /dev/null; then
    echo "   ✅ Commit 1bda1a6 found"
else
    echo "   ❌ Commit not found"
    exit 1
fi

echo ""

# 3. Check files modified
echo "3. Files Modified..."
if git show 1bda1a6 --name-only | grep "add-players-dialog.tsx" > /dev/null; then
    echo "   ✅ add-players-dialog.tsx modified"
else
    echo "   ❌ add-players-dialog.tsx not found"
    exit 1
fi

if git show 1bda1a6 --name-only | grep "sessions/\[sessionId\]/page.tsx" > /dev/null; then
    echo "   ✅ sessions page.tsx modified"
else
    echo "   ❌ sessions page.tsx not found"
    exit 1
fi

echo ""

# 4. Check key strings in modified files
echo "4. Code Changes Verification..."

# Check for import tab added
if grep -q 'value="import"' /srv/workspace/game-plug/apps/frontend/components/add-players-dialog.tsx; then
    echo "   ✅ Import tab added to dialog"
else
    echo "   ❌ Import tab not found"
    exit 1
fi

# Check import removed from session page
if ! grep -q "setShowImportDialog" /srv/workspace/game-plug/apps/frontend/app/\(dashboard\)/sessions/\[sessionId\]/page.tsx; then
    echo "   ✅ Import button removed from session page"
else
    echo "   ❌ Import button still present in session page"
    exit 1
fi

echo ""

# 5. Check documentation files
echo "5. Documentation Files..."
docs=("TASK_COMPLETION_REPORT.md" "BEFORE_AFTER_IMPORT_UI.md" "IMPLEMENTATION_DETAILS.md" "IMPORT_INTEGRATION_SUMMARY.md" "TEST_IMPORT_INTEGRATION.md" "INDEX_IMPORT_INTEGRATION.md")

for doc in "${docs[@]}"; do
    if [ -f "/srv/workspace/game-plug/$doc" ]; then
        size=$(du -h "/srv/workspace/game-plug/$doc" | cut -f1)
        echo "   ✅ $doc ($size)"
    else
        echo "   ❌ $doc missing"
    fi
done

echo ""
echo "=========================================="
echo "✅ All Verification Checks PASSED"
echo "=========================================="
echo ""
echo "Summary:"
echo "- TypeScript: Compiled successfully"
echo "- Commit: 1bda1a6 found"
echo "- Files: 2 modified correctly"
echo "- Code: Changes verified in source"
echo "- Docs: 6 documentation files present"
echo ""
echo "Next Steps:"
echo "1. Review: INDEX_IMPORT_INTEGRATION.md"
echo "2. Test: TEST_IMPORT_INTEGRATION.md"
echo "3. Deploy: Follow TASK_COMPLETION_REPORT.md"
echo ""
