import re
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/eval", tags=["Evaluation Lab"])

class WerRequest(BaseModel):
    reference: str
    hypothesis: str
    language: str = "hi"

class WerResponse(BaseModel):
    referenceWords: int
    hypothesisWords: int
    substitutions: int
    deletions: int
    insertions: int
    hits: int
    wer: float
    werPercentage: str
    alignment: list[dict]

def normalize_text_for_eval(text: str) -> list[str]:
    """Cleans punctuation, collapses spaces, and tokenizes words"""
    # Remove punctuation while preserving Devanagari & alphanumeric
    cleaned = re.sub(r"[^\w\s\u0900-\u097F]", " ", text.lower())
    words = cleaned.split()
    return words

def compute_wer(ref_words: list[str], hyp_words: list[str]) -> dict:
    """
    Standard dynamic programming algorithm for Levenshtein word error rate.
    Returns (S, D, I, H, WER)
    """
    r_len = len(ref_words)
    h_len = len(hyp_words)

    # DP table: (r_len + 1) x (h_len + 1)
    dp = [[0] * (h_len + 1) for _ in range(r_len + 1)]

    for i in range(r_len + 1):
        dp[i][0] = i
    for j in range(h_len + 1):
        dp[0][j] = j

    for i in range(1, r_len + 1):
        for j in range(1, h_len + 1):
            if ref_words[i - 1] == hyp_words[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                substitution = dp[i - 1][j - 1] + 1
                deletion = dp[i - 1][j] + 1
                insertion = dp[i][j - 1] + 1
                dp[i][j] = min(substitution, deletion, insertion)

    # Backtrace to compute S, D, I, H
    i = r_len
    j = h_len
    s = d = ins = h = 0
    alignment = []

    while i > 0 or j > 0:
        if i > 0 and j > 0 and ref_words[i - 1] == hyp_words[j - 1]:
            h += 1
            alignment.append({"op": "MATCH", "ref": ref_words[i - 1], "hyp": hyp_words[j - 1]})
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i - 1][j - 1] + 1:
            s += 1
            alignment.append({"op": "SUBSTITUTION", "ref": ref_words[i - 1], "hyp": hyp_words[j - 1]})
            i -= 1
            j -= 1
        elif i > 0 and dp[i][j] == dp[i - 1][j] + 1:
            d += 1
            alignment.append({"op": "DELETION", "ref": ref_words[i - 1], "hyp": ""})
            i -= 1
        else:
            ins += 1
            alignment.append({"op": "INSERTION", "ref": "", "hyp": hyp_words[j - 1]})
            j -= 1

    alignment.reverse()
    total_ref = max(r_len, 1)
    wer_val = round((s + d + ins) / total_ref, 4)

    return {
        "referenceWords": r_len,
        "hypothesisWords": h_len,
        "substitutions": s,
        "deletions": d,
        "insertions": ins,
        "hits": h,
        "wer": wer_val,
        "werPercentage": f"{wer_val * 100:.1f}%",
        "alignment": alignment
    }

@router.post("/wer", response_model=WerResponse)
async def evaluate_wer(req: WerRequest):
    ref_tokens = normalize_text_for_eval(req.reference)
    hyp_tokens = normalize_text_for_eval(req.hypothesis)
    result = compute_wer(ref_tokens, hyp_tokens)
    return WerResponse(**result)
