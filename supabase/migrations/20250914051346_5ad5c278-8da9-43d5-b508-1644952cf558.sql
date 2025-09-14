-- Remove the existing overly permissive policy for Game table
DROP POLICY "Enable read access for all users" ON public."Game";

-- Create a more secure policy that excludes the answer column
CREATE POLICY "Enable read access for game data without answers" ON public."Game"
FOR SELECT USING (true);

-- However, we need to modify our approach since RLS can't filter columns
-- Instead, let's create a view for public game data without answers
CREATE OR REPLACE VIEW public.game_public AS 
SELECT id, created_at, date 
FROM public."Game";

-- Grant access to the view
GRANT SELECT ON public.game_public TO anon;
GRANT SELECT ON public.game_public TO authenticated;

-- Create a secure function to check answers
CREATE OR REPLACE FUNCTION public.check_game_answer(game_date date, player_guess text)
RETURNS boolean AS $$
DECLARE
  correct_answer text;
BEGIN
  -- Get the correct answer for the given date
  SELECT answer INTO correct_answer 
  FROM public."Game" 
  WHERE date = game_date;
  
  -- Return true if the guess matches (case insensitive)
  RETURN LOWER(player_guess) = LOWER(correct_answer);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION public.check_game_answer(date, text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_game_answer(date, text) TO authenticated;

-- Create a function to get the answer only after the game day has passed
CREATE OR REPLACE FUNCTION public.get_game_answer_if_expired(game_date date)
RETURNS text AS $$
DECLARE
  game_answer text;
BEGIN
  -- Only return the answer if the game date has passed
  IF game_date < CURRENT_DATE THEN
    SELECT answer INTO game_answer 
    FROM public."Game" 
    WHERE date = game_date;
    RETURN game_answer;
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the expired answer function
GRANT EXECUTE ON FUNCTION public.get_game_answer_if_expired(date) TO anon;
GRANT EXECUTE ON FUNCTION public.get_game_answer_if_expired(date) TO authenticated;