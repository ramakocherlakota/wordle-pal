export default function HelpText() {
  return (
   <div>
      <h1>Wordle Pal</h1>
      Wordle Pal is an app to help you understand Wordle (and its
      cousins, Quordle and Sequence) and hopefully to help you play better.  
      <h2>Practice</h2>
      <p>
      There are five ways of using Wordle Pal, depending on what you
    are trying to do, each corresponding to one of the tabs across the
    top of the page.  The first tab is for Practice and it's just
    what it sounds like - you can practice Wordling or Quordling to
    your heart's content.  Select your puzzle mode (Wordle, Quordle or
    Sequence) in the upper right corner and start guessing.
      </p>
      <p>
    The responses for your guesses are either in the form of color
    coding of the letters in your word (orange means your letter is
    correct and in the right place, blue means the letter is correct
    but not in the right place) or else, in monochrome mode, using the
    old Mastermind coding system where a B (black peg) corresponds to
    "right in the right place" and a W (white peg) corresponds to
    (right but in the wrong place).  For people with vision issues,
    monochrome mode is probably going to be easier to use (and it
    takes up less space on your screen) but ordinary non-monochrome
    mode is closer to what most people are used to.
      </p>
      <p>
    After you've guessed at least once there will be a button at the
    bottmm of the list of guesses labeled with an ABC - you can click
    on that to view a summary of what letters have been guessed and
    which ones are in or out of the solution so far.  Click on that
    summary again to make it disappear.
</p><p>
    Once you're finished with the puzzle (either by solving it or by
    running out of guesses) a new button will appear, allowing you to
    "Show Luck".  This wil take you to the Luck pane, prepoulated with
      the guesses you made, so you can get a sense of how you did versus
    a random player with the information you had.
    </p>
      <h2>Luck</h2>
      <p>
      In the Luck panel, fill out the Target words and Guesses and click
    on Go to get a rating of how lucky each of your guesses was.  The
    higher the number next to the four-leaf clover, the luckier you
    were.  For instance, if you guess the right answer in a Wordle
    on your first guess, your guess has 11 bits of luck because there
    were 11 bits of uncertainty (approximately) about the answer to
    begin with and you got rid of all the uncertainty in one go.
      Specifically the luck is computed as the remaining uncertainty
    after your guess minus the expected uncertainty - so if your guess
    is unluckier than expected, you'll have negative luck.
</p><p>
    If you click on one of the cells in the luck output you'll get a
    popup with more information about where the luck number came from.
</p><p>
    It can take a little while for the results to be returned,
    especially for a Quordle or Sequence so please be patient.
</p><p>
    There are links from the Luck output to the other tabs: Remaning,
    Guess and Solve - you can click on these to get the corresponding
    tab pre-loaded.
</p>
      <h2>Remaining</h2>
<p>
    After you fill in (or pre-fill) the guesses and scores and click
    Go you'll get back a list of the possible solutions based on what
    is known at this point in the puzzle.
</p>
    <h2>Guess</h2>
<p>
    Just like Remaining except that returns a list of the possible
    guesses, ranked in order of increasing expected uncertainty.  This
    can be more time-consuming than Luck or Remaining, so be patient.
</p>
    <h2>Solve</h2>
<p>
    Enter the target words and some initial guesses (if you like) and
    see how Wordle Pal would go about solving it.
</p>
    <h2>Settings Dialog</h2>
<p>
    There are three settings you can control in the Settings dialog.
    Hard mode toggles Wordle hard mode - if you hard mode turned on
    then your guesses in Practice and all the guesses that are made in
    the other tabs must abide by the hard mode constraint.  In Wordle
    and Sequence, this means that your guess must be consistent with what
    is already known about the solution.  In Quordle, this means that
    your guess must be consistent with what is known about at least
    one of the solutions.
</p><p>
    All Guesses mode toggles between allowing all allowed Wordle words
    as guesses (> 11,000 words) or only the ones that are actually
    solutions (~2300 words).  The All Guesses mode is more realistic,
    of course, but the computations are also slower (so you might need
    to be even more patient on the Solve and Guess panel).
</p><p>
    Monochrome mode toggles between the colored and monochrome views
    of scores.  (See the description above in the Practice section.)
</p>
    <h2>How It Works</h2>
<p>
    The program is based on information theory and you can find a
    description of how it works in the <a target='_blank' href='./slides.pdf'>slides</a> from a presentation I
    gave at the Cox Automotive Product Group 2022 LevelUp conference.
</p>
      </div>
  );
}
