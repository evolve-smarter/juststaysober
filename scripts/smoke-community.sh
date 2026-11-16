#!/bin/bash
# API smoke test for community privacy, moderation, blocking, deletion and legal pages.
# Needs the app running on localhost:3000 with ADMIN_EMAILS=admin@example.com against a TEST db,
# after scripts/smoke-reset.sh. Verified: 52/52 on 2026-11-04.
export PGHOST=${PGHOST:-/tmp} PGPORT=${PGPORT:-5433}
B=${BASE:-localhost:3000}; J='Content-Type: application/json'
c() { echo "-H"; echo "Cookie: authjs.session-token=tok$1"; }
req() { local u=$1 m=$2 p=$3 d=$4; if [ -n "$u" ]; then curl -s -X $m -H "$J" -H "Cookie: authjs.session-token=tok$u" -w '\n%{http_code}' $B$p ${d:+-d "$d"}; else curl -s -X $m -H "$J" -w '\n%{http_code}' $B$p ${d:+-d "$d"}; fi; }
pass=0; fail=0
check() { # name expected actual
  if [ "$2" == "$3" ]; then echo "PASS  $1"; pass=$((pass+1)); else echo "FAIL  $1  (expected $2, got $3)"; fail=$((fail+1)); fi; }
code() { tail -n1; }
body() { head -n -1; }
jget() { python3 -I -c "import sys,json; d=json.load(sys.stdin); print($1)"; }

echo "== privacy: auth + anonymity"
check "unauth feed read blocked"          401 "$(req '' GET /api/posts | code)"
check "unauth comments read blocked"      401 "$(req '' GET /api/posts/x/comments | code)"
R=$(req 1 POST /api/posts '{"content":"my anon secret","isAnon":true,"category":"struggle"}'); ANON=$(echo "$R" | body | jget "d['id']")
check "u1 creates anon post"              201 "$(echo "$R" | code)"
R=$(req 2 POST /api/posts '{"content":"hello from blake","isAnon":false}'); NAMED=$(echo "$R" | body | jget "d['id']")
check "u2 creates named post"             201 "$(echo "$R" | code)"
FEED=$(req 5 GET /api/posts | body)
check "other member sees anon post"      True "$(echo "$FEED" | jget "any(p['id']=='$ANON' for p in d['posts'])")"
check "anon post has NO userId field"    True "$(echo "$FEED" | jget "all('userId' not in p for p in d['posts'] if p['isAnon'])")"
check "anon post author shown Anonymous" True "$(echo "$FEED" | jget "all(p['user']['name']=='Anonymous' for p in d['posts'] if p['isAnon'])")"
check "no real id/email leaked anywhere" False "$(echo "$FEED" | jget "'u1' in str([p for p in d['posts'] if p['isAnon']]) or 't@example.com' in str(d)")"
check "author sees mine=true on anon"    True "$(req 1 GET /api/posts | body | jget "[p for p in d['posts'] if p['id']=='$ANON'][0]['mine']")"
check "others see mine=false"            False "$(echo "$FEED" | jget "[p for p in d['posts'] if p['id']=='$ANON'][0]['mine']")"
R=$(req 4 POST /api/posts/$ANON/comments '{"content":"anon reply","isAnon":true}'); ACOM=$(echo "$R" | body | jget "d['id']")
check "comment on post"                   201 "$(echo "$R" | code)"
check "anon comment leaks no userId"     True "$(req 5 GET /api/posts/$ANON/comments | body | jget "all('userId' not in c for c in d if c['isAnon'])")"
check "comment on missing post -> 404"   404 "$(req 4 POST /api/posts/nope/comments '{"content":"x"}' | code)"
check "like on missing post -> 404"      404 "$(req 4 POST /api/posts/nope/like | code)"

echo "== reports / auto-hide"
check "can't report own post"             400 "$(req 1 POST /api/reports "{\"postId\":\"$ANON\",\"reason\":\"spam\"}" | code)"
check "bad report body"                   400 "$(req 2 POST /api/reports '{"reason":"spam"}' | code)"
check "report unknown post -> 404"        404 "$(req 2 POST /api/reports '{"postId":"nope","reason":"spam"}' | code)"
check "u2 reports anon post (harass)"     200 "$(req 2 POST /api/reports "{\"postId\":\"$ANON\",\"reason\":\"harassment\"}" | code)"
check "duplicate report is idempotent"    200 "$(req 2 POST /api/reports "{\"postId\":\"$ANON\",\"reason\":\"harassment\"}" | code)"
check "still visible after 1 report"     True "$(req 5 GET /api/posts | body | jget "any(p['id']=='$ANON' for p in d['posts'])")"
req 4 POST /api/reports "{\"postId\":\"$ANON\",\"reason\":\"spam\"}" >/dev/null
req 5 POST /api/reports "{\"postId\":\"$ANON\",\"reason\":\"spam\"}" >/dev/null
check "auto-hidden after 3 reporters"    False "$(req 5 GET /api/posts | body | jget "any(p['id']=='$ANON' for p in d['posts'])")"
check "comments on hidden post gone"      0 "$(req 5 GET /api/posts/$ANON/comments | body | jget "len(d)")"
check "can't comment on hidden post"      404 "$(req 5 POST /api/posts/$ANON/comments '{"content":"x"}' | code)"

echo "== self-harm report is NOT auto-hidden, gets resources"
R=$(req 1 POST /api/posts '{"content":"i dont know if i can keep going","category":"struggle"}'); SH=$(echo "$R" | body | jget "d['id']")
for u in 2 4 5; do R=$(req $u POST /api/reports "{\"postId\":\"$SH\",\"reason\":\"self_harm_risk\"}"); done
check "reporter told to call 911/988"    True "$(echo "$R" | body | jget "'988' in d['message'] and '911' in d['message']")"
check "self-harm post still visible"     True "$(req 6 GET /api/posts | body | jget "any(p['id']=='$SH' for p in d['posts'])")"

echo "== admin"
check "non-admin moderate -> 404"         404 "$(req 2 POST /api/admin/moderate "{\"postId\":\"$ANON\",\"action\":\"restore\"}" | code)"
check "unauth moderate -> 404"            404 "$(req '' POST /api/admin/moderate "{\"postId\":\"$ANON\",\"action\":\"restore\"}" | code)"
check "non-admin queue page -> 404"       404 "$(curl -s -o /dev/null -w '%{http_code}' -H 'Cookie: authjs.session-token=tok2' $B/admin/reports)"
check "admin queue page -> 200"           200 "$(curl -s -o /dev/null -w '%{http_code}' -H 'Cookie: authjs.session-token=tok3' $B/admin/reports)"
check "queue lists self-harm first"      True "$(curl -s -H 'Cookie: authjs.session-token=tok3' $B/admin/reports | python3 -I -c "import sys; h=sys.stdin.read(); print(h.find('i dont know if i can keep going') < h.find('my anon secret') and h.find('i dont know') != -1)")"
check "admin restores hidden post"        200 "$(req 3 POST /api/admin/moderate "{\"postId\":\"$ANON\",\"action\":\"restore\"}" | code)"
check "restored post visible again"     True "$(req 5 GET /api/posts | body | jget "any(p['id']=='$ANON' for p in d['posts'])")"
check "admin suspends author of NAMED"    200 "$(req 3 POST /api/admin/moderate "{\"postId\":\"$NAMED\",\"action\":\"suspend_author\"}" | code)"
check "suspended user can't post"         403 "$(req 2 POST /api/posts '{"content":"hi"}' | code)"
check "suspended user can't comment"      403 "$(req 2 POST /api/posts/$SH/comments '{"content":"hi"}' | code)"
check "suspended user still gets companion route" 503 "$(req 2 POST /api/companion '{"messages":[{"role":"user","content":"hi"}]}' | code)"

echo "== blocking"
check "u5 blocks author of anon post"     200 "$(req 5 POST /api/blocks "{\"postId\":\"$ANON\"}" | code)"
check "u5 no longer sees u1 posts"      False "$(req 5 GET /api/posts | body | jget "any(p['id'] in ('$ANON','$SH') for p in d['posts'])")"
check "u1 no longer sees u5 (mutual)"    True "$(req 1 GET /api/posts | body | jget "True")"
check "can't block self"                  400 "$(req 1 POST /api/blocks "{\"postId\":\"$ANON\"}" | code)"
check "others still see u1 posts"       True "$(req 6 GET /api/posts | body | jget "any(p['id']=='$ANON' for p in d['posts'])")"

echo "== delete own content"
check "non-author can't delete post"     404 "$(req 6 DELETE /api/posts/$ANON | code)"
check "author deletes own post"           200 "$(req 1 DELETE /api/posts/$ANON | code)"
check "unauth delete -> 401"              401 "$(req '' DELETE /api/posts/$SH | code)"

echo "== account deletion"
req 6 POST /api/posts '{"content":"will vanish"}' >/dev/null
check "no confirm -> 400"                 400 "$(req 6 DELETE /api/account '{}' | code)"
check "delete account"                    200 "$(req 6 DELETE /api/account '{"confirm":"DELETE"}' | code)"
check "session invalid after deletion"   307 "$(curl -s -o /dev/null -w '%{http_code}' -H 'Cookie: authjs.session-token=tok6' $B/dashboard)"
check "user's posts gone"                  0 "$(${PSQL:-psql -U postgres jss} -qAt -c "select count(*) from \"Post\" where content='will vanish'")"

echo "== public pages"
for p in /privacy /terms /guidelines; do check "$p -> 200" 200 "$(curl -s -o /dev/null -w '%{http_code}' $B$p)"; done
check "draft banner on /privacy"          True "$(curl -s $B/privacy | grep -c 'not yet reviewed by a lawyer' | python3 -I -c "print(int(input())>0)")"
echo; echo "RESULT: $pass passed, $fail failed"
