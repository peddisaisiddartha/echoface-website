function detectWord(
    mouthHeight,
    mouthWidth
) {

    if (mouthHeight > 0.06) {

        return "HELLO";
    }

    else if (mouthWidth > 0.15) {

        return "YES";
    }

    else {

        return "NO";
    }
}
