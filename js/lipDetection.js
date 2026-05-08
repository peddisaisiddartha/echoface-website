function detectWord(
    mouthHeight,
    mouthWidth
) {

    const ratio =
        mouthHeight /
        mouthWidth;

    // HELLO
    if (
        mouthHeight > 0.07
    ) {

        return "HELLO";
    }

    // YES
    else if (
        mouthWidth > 0.18
    ) {

        return "YES";
    }

    // WATER
    else if (
        ratio > 0.5
    ) {

        return "WATER";
    }

    // HELP
    else if (
        mouthHeight > 0.045
    ) {

        return "HELP";
    }

    // THANK YOU
    else if (
        mouthHeight > 0.03
    ) {

        return "THANK YOU";
    }

    // STOP
    else if (
        mouthWidth < 0.11
    ) {

        return "STOP";
    }

    // NO
    else {

        return "NO";
    }
}
