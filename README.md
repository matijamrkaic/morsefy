# Morsefy

- Fullscreen app that simply prompts you to start typing
- As you type, both letters and morse code appears on split screen
- Morse code is automatically played out with both sound and subtle visuals flashes of light.

## Algorithm

### Input

1. Typed characters are stored in the array stack for playing
2. Also stored to be displayed + translated on screen.

### Output

1. Pop first item from stack
2. Convert to morse counterpart (figure how special characters are mapped ).
3. Based on the morse code, play the shorter or longer sound and correctly make pauses.
4. Go to 1.

- Input event should trigger output start (if not currently in progress).
