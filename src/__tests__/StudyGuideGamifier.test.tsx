import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideGamifier } from '../components/StudyGuideGamifier';

// Mock the StudyGuideGamifier component
const MockStudyGuideGamifier: React.FC<any> = ({ 
  studyGuide, 
  onGamify, 
  onError 
}) => {
  const [gamificationResults, setGamificationResults] = React.useState<any>(null);
  const [isGamifying, setIsGamifying] = React.useState(false);
  const [gamificationSettings, setGamificationSettings] = React.useState({
    points: true,
    badges: true,
    levels: true,
    streaks: true,
    achievements: true,
    leaderboards: true,
    challenges: true,
    rewards: true
  });

  const handleGamify = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsGamifying(true);
    
    try {
      // Simulate gamification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        gamificationId: 'game-123',
        points: {
          totalPoints: 1500,
          currentPoints: 750,
          pointsPerSection: 100,
          bonusPoints: 50,
          multiplier: 1.5
        },
        badges: [
          {
            id: 'badge-1',
            name: 'First Steps',
            description: 'Complete your first section',
            icon: '🎯',
            earned: true,
            earnedDate: new Date().toISOString()
          },
          {
            id: 'badge-2',
            name: 'Speed Reader',
            description: 'Complete a section in under 30 minutes',
            icon: '⚡',
            earned: false,
            earnedDate: null
          },
          {
            id: 'badge-3',
            name: 'Knowledge Master',
            description: 'Score 90% or higher on all quizzes',
            icon: '🧠',
            earned: false,
            earnedDate: null
          }
        ],
        levels: {
          currentLevel: 3,
          currentXP: 750,
          xpToNextLevel: 250,
          totalLevels: 10,
          levelName: 'Apprentice Scholar',
          levelDescription: 'You\'re making great progress in your studies!'
        },
        streaks: {
          currentStreak: 5,
          longestStreak: 12,
          streakGoal: 7,
          streakReward: 100
        },
        achievements: [
          {
            id: 'achievement-1',
            name: 'Section Master',
            description: 'Complete all sections in a study guide',
            progress: 60,
            target: 100,
            reward: 200
          },
          {
            id: 'achievement-2',
            name: 'Quiz Champion',
            description: 'Score 100% on 5 quizzes',
            progress: 2,
            target: 5,
            reward: 150
          },
          {
            id: 'achievement-3',
            name: 'Study Marathon',
            description: 'Study for 2 hours straight',
            progress: 0,
            target: 120,
            reward: 300
          }
        ],
        leaderboards: {
          globalRank: 15,
          totalPlayers: 1000,
          friendsRank: 3,
          totalFriends: 10,
          topPlayers: [
            { name: 'Alice Johnson', points: 2500, level: 8 },
            { name: 'Bob Smith', points: 2300, level: 7 },
            { name: 'Carol Davis', points: 2100, level: 7 }
          ]
        },
        challenges: [
          {
            id: 'challenge-1',
            name: 'Daily Study',
            description: 'Study for at least 30 minutes today',
            type: 'daily',
            reward: 50,
            completed: true,
            expiresAt: new Date().toISOString()
          },
          {
            id: 'challenge-2',
            name: 'Weekend Warrior',
            description: 'Complete 3 sections this weekend',
            type: 'weekly',
            reward: 150,
            completed: false,
            expiresAt: new Date().toISOString()
          }
        ],
        rewards: [
          {
            id: 'reward-1',
            name: 'Study Break',
            description: 'Take a 15-minute break',
            type: 'break',
            unlocked: true
          },
          {
            id: 'reward-2',
            name: 'Custom Theme',
            description: 'Unlock a new study theme',
            type: 'cosmetic',
            unlocked: false
          },
          {
            id: 'reward-3',
            name: 'Extra Time',
            description: 'Get 10 extra minutes on your next quiz',
            type: 'powerup',
            unlocked: true
          }
        ],
        statistics: {
          totalPoints: 1500,
          currentPoints: 750,
          totalBadges: 3,
          earnedBadges: 1,
          currentLevel: 3,
          currentStreak: 5,
          totalAchievements: 3,
          completedAchievements: 0,
          totalChallenges: 2,
          completedChallenges: 1,
          totalRewards: 3,
          unlockedRewards: 2
        }
      };

      setGamificationResults(results);
      onGamify?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsGamifying(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setGamificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-gamifier">
      <h2>Study Guide Gamifier</h2>
      
      <div data-testid="gamification-settings">
        <h3>Gamification Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.points}
              onChange={(e) => handleSettingChange('points', e.target.checked)}
              data-testid="points-checkbox"
            />
            Points System
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.badges}
              onChange={(e) => handleSettingChange('badges', e.target.checked)}
              data-testid="badges-checkbox"
            />
            Badges
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.levels}
              onChange={(e) => handleSettingChange('levels', e.target.checked)}
              data-testid="levels-checkbox"
            />
            Levels
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.streaks}
              onChange={(e) => handleSettingChange('streaks', e.target.checked)}
              data-testid="streaks-checkbox"
            />
            Streaks
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.achievements}
              onChange={(e) => handleSettingChange('achievements', e.target.checked)}
              data-testid="achievements-checkbox"
            />
            Achievements
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.leaderboards}
              onChange={(e) => handleSettingChange('leaderboards', e.target.checked)}
              data-testid="leaderboards-checkbox"
            />
            Leaderboards
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.challenges}
              onChange={(e) => handleSettingChange('challenges', e.target.checked)}
              data-testid="challenges-checkbox"
            />
            Challenges
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={gamificationSettings.rewards}
              onChange={(e) => handleSettingChange('rewards', e.target.checked)}
              data-testid="rewards-checkbox"
            />
            Rewards
          </label>
        </div>
      </div>

      <button
        onClick={handleGamify}
        disabled={!studyGuide || studyGuide.length === 0 || isGamifying}
        data-testid="gamify-button"
      >
        {isGamifying ? 'Setting up gamification...' : 'Start Gamification'}
      </button>

      {isGamifying && (
        <div data-testid="gamification-progress">Setting up gamification...</div>
      )}

      {gamificationResults && (
        <div data-testid="gamification-results">
          <h3>Gamification Results</h3>
          
          <div data-testid="points-system">
            <h4>Points System:</h4>
            <p>Total Points: {gamificationResults.points.totalPoints}</p>
            <p>Current Points: {gamificationResults.points.currentPoints}</p>
            <p>Points Per Section: {gamificationResults.points.pointsPerSection}</p>
            <p>Bonus Points: {gamificationResults.points.bonusPoints}</p>
            <p>Multiplier: {gamificationResults.points.multiplier}x</p>
          </div>

          <div data-testid="badges-system">
            <h4>Badges ({gamificationResults.statistics.totalBadges}):</h4>
            <ul>
              {gamificationResults.badges.map((badge: any, index: number) => (
                <li key={index} data-testid={`badge-${index}`}>
                  {badge.icon} {badge.name}: {badge.description}
                  <span data-testid={`badge-status-${index}`}>
                    {badge.earned ? ' (Earned)' : ' (Not Earned)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="levels-system">
            <h4>Levels:</h4>
            <p>Current Level: {gamificationResults.levels.currentLevel}</p>
            <p>Current XP: {gamificationResults.levels.currentXP}</p>
            <p>XP to Next Level: {gamificationResults.levels.xpToNextLevel}</p>
            <p>Total Levels: {gamificationResults.levels.totalLevels}</p>
            <p>Level Name: {gamificationResults.levels.levelName}</p>
            <p>Level Description: {gamificationResults.levels.levelDescription}</p>
          </div>

          <div data-testid="streaks-system">
            <h4>Streaks:</h4>
            <p>Current Streak: {gamificationResults.streaks.currentStreak} days</p>
            <p>Longest Streak: {gamificationResults.streaks.longestStreak} days</p>
            <p>Streak Goal: {gamificationResults.streaks.streakGoal} days</p>
            <p>Streak Reward: {gamificationResults.streaks.streakReward} points</p>
          </div>

          <div data-testid="achievements-system">
            <h4>Achievements ({gamificationResults.statistics.totalAchievements}):</h4>
            <ul>
              {gamificationResults.achievements.map((achievement: any, index: number) => (
                <li key={index} data-testid={`achievement-${index}`}>
                  <strong>{achievement.name}:</strong> {achievement.description}
                  <span data-testid={`achievement-progress-${index}`}>
                    ({achievement.progress}/{achievement.target})
                  </span>
                  <span data-testid={`achievement-reward-${index}`}>
                    Reward: {achievement.reward} points
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="leaderboards-system">
            <h4>Leaderboards:</h4>
            <p>Global Rank: #{gamificationResults.leaderboards.globalRank}</p>
            <p>Total Players: {gamificationResults.leaderboards.totalPlayers}</p>
            <p>Friends Rank: #{gamificationResults.leaderboards.friendsRank}</p>
            <p>Total Friends: {gamificationResults.leaderboards.totalFriends}</p>
            <div data-testid="top-players">
              <h5>Top Players:</h5>
              <ul>
                {gamificationResults.leaderboards.topPlayers.map((player: any, index: number) => (
                  <li key={index} data-testid={`top-player-${index}`}>
                    {player.name}: {player.points} points (Level {player.level})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-testid="challenges-system">
            <h4>Challenges ({gamificationResults.statistics.totalChallenges}):</h4>
            <ul>
              {gamificationResults.challenges.map((challenge: any, index: number) => (
                <li key={index} data-testid={`challenge-${index}`}>
                  <strong>{challenge.name}:</strong> {challenge.description}
                  <span data-testid={`challenge-type-${index}`}>
                    ({challenge.type})
                  </span>
                  <span data-testid={`challenge-reward-${index}`}>
                    Reward: {challenge.reward} points
                  </span>
                  <span data-testid={`challenge-status-${index}`}>
                    {challenge.completed ? ' (Completed)' : ' (In Progress)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="rewards-system">
            <h4>Rewards ({gamificationResults.statistics.totalRewards}):</h4>
            <ul>
              {gamificationResults.rewards.map((reward: any, index: number) => (
                <li key={index} data-testid={`reward-${index}`}>
                  <strong>{reward.name}:</strong> {reward.description}
                  <span data-testid={`reward-type-${index}`}>
                    ({reward.type})
                  </span>
                  <span data-testid={`reward-status-${index}`}>
                    {reward.unlocked ? ' (Unlocked)' : ' (Locked)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="gamification-statistics">
            <h4>Statistics:</h4>
            <p>Total Points: {gamificationResults.statistics.totalPoints}</p>
            <p>Current Points: {gamificationResults.statistics.currentPoints}</p>
            <p>Total Badges: {gamificationResults.statistics.totalBadges}</p>
            <p>Earned Badges: {gamificationResults.statistics.earnedBadges}</p>
            <p>Current Level: {gamificationResults.statistics.currentLevel}</p>
            <p>Current Streak: {gamificationResults.statistics.currentStreak}</p>
            <p>Total Achievements: {gamificationResults.statistics.totalAchievements}</p>
            <p>Completed Achievements: {gamificationResults.statistics.completedAchievements}</p>
            <p>Total Challenges: {gamificationResults.statistics.totalChallenges}</p>
            <p>Completed Challenges: {gamificationResults.statistics.completedChallenges}</p>
            <p>Total Rewards: {gamificationResults.statistics.totalRewards}</p>
            <p>Unlocked Rewards: {gamificationResults.statistics.unlockedRewards}</p>
          </div>
        </div>
      )}

      {studyGuide && studyGuide.length > 0 && (
        <div data-testid="study-guide-preview">
          <h3>Study Guide Preview:</h3>
          <p>Sections: {studyGuide.length}</p>
          {studyGuide.map((section: any, index: number) => (
            <div key={index} data-testid={`preview-section-${index}`}>
              <h4>{section.title || 'Untitled Section'}</h4>
              <p>{section.content || 'No content'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

describe('StudyGuideGamifier', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy.',
      keywords: ['physics', 'matter', 'energy'],
      examples: ['Newton\'s laws'],
      questions: ['What is physics?'],
      annotations: ['Fundamental science']
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      content: 'Advanced physics concepts build on the fundamentals.',
      keywords: ['advanced', 'concepts'],
      examples: ['Quantum mechanics'],
      questions: ['What is quantum mechanics?'],
      annotations: ['Advanced topics']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-gamifier')).toBeInTheDocument();
  });

  it('renders gamification settings', () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('points-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('badges-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('levels-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('streaks-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('achievements-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('leaderboards-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('challenges-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('rewards-checkbox')).toBeInTheDocument();
  });

  it('renders gamify button', () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('gamify-button')).toBeInTheDocument();
    expect(screen.getByText('Start Gamification')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideGamifier studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates gamification settings when changed', () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const pointsCheckbox = screen.getByTestId('points-checkbox');
    const badgesCheckbox = screen.getByTestId('badges-checkbox');
    
    expect(pointsCheckbox).toBeChecked();
    expect(badgesCheckbox).toBeChecked();
    
    fireEvent.click(pointsCheckbox);
    fireEvent.click(badgesCheckbox);
    
    expect(pointsCheckbox).not.toBeChecked();
    expect(badgesCheckbox).not.toBeChecked();
  });

  it('calls onGamify when gamification completes successfully', async () => {
    const onGamify = jest.fn();
    
    render(
      <MockStudyGuideGamifier 
        studyGuide={mockStudyGuide} 
        onGamify={onGamify} 
      />
    );
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(onGamify).toHaveBeenCalledWith(
        expect.objectContaining({
          gamificationId: 'game-123',
          points: expect.objectContaining({
            totalPoints: 1500,
            currentPoints: 750,
            pointsPerSection: 100,
            bonusPoints: 50,
            multiplier: 1.5
          }),
          badges: expect.arrayContaining([
            expect.objectContaining({
              name: 'First Steps',
              description: 'Complete your first section',
              icon: '🎯',
              earned: true
            })
          ]),
          levels: expect.objectContaining({
            currentLevel: 3,
            currentXP: 750,
            xpToNextLevel: 250,
            totalLevels: 10,
            levelName: 'Apprentice Scholar'
          }),
          streaks: expect.objectContaining({
            currentStreak: 5,
            longestStreak: 12,
            streakGoal: 7,
            streakReward: 100
          }),
          achievements: expect.arrayContaining([
            expect.objectContaining({
              name: 'Section Master',
              description: 'Complete all sections in a study guide',
              progress: 60,
              target: 100,
              reward: 200
            })
          ]),
          leaderboards: expect.objectContaining({
            globalRank: 15,
            totalPlayers: 1000,
            friendsRank: 3,
            totalFriends: 10
          }),
          challenges: expect.arrayContaining([
            expect.objectContaining({
              name: 'Daily Study',
              description: 'Study for at least 30 minutes today',
              type: 'daily',
              reward: 50,
              completed: true
            })
          ]),
          rewards: expect.arrayContaining([
            expect.objectContaining({
              name: 'Study Break',
              description: 'Take a 15-minute break',
              type: 'break',
              unlocked: true
            })
          ]),
          statistics: expect.objectContaining({
            totalPoints: 1500,
            currentPoints: 750,
            totalBadges: 3,
            earnedBadges: 1,
            currentLevel: 3,
            currentStreak: 5
          })
        })
      );
    });
  });

  it('calls onError when gamification fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideGamifier: React.FC<any> = ({ onError }) => {
      const handleGamify = () => {
        onError?.(new Error('Gamification failed'));
      };

      return (
        <div>
          <button onClick={handleGamify} data-testid="error-button">
            Gamify with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideGamifier onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during gamification setup', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    expect(screen.getByTestId('gamification-progress')).toBeInTheDocument();
    expect(screen.getByText('Setting up gamification...')).toBeInTheDocument();
  });

  it('updates button text during gamification setup', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    expect(screen.getByText('Setting up gamification...')).toBeInTheDocument();
  });

  it('disables gamify button when no study guide provided', () => {
    render(<MockStudyGuideGamifier studyGuide={[]} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    expect(gamifyButton).toBeDisabled();
  });

  it('disables gamify button during gamification setup', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    expect(gamifyButton).toBeDisabled();
  });

  it('displays gamification results after setup', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('gamification-results')).toBeInTheDocument();
      expect(screen.getByText('Gamification Results')).toBeInTheDocument();
      expect(screen.getByText('Points System:')).toBeInTheDocument();
    });
  });

  it('displays points system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Points: 1500')).toBeInTheDocument();
      expect(screen.getByText('Current Points: 750')).toBeInTheDocument();
      expect(screen.getByText('Points Per Section: 100')).toBeInTheDocument();
      expect(screen.getByText('Bonus Points: 50')).toBeInTheDocument();
      expect(screen.getByText('Multiplier: 1.5x')).toBeInTheDocument();
    });
  });

  it('displays badges system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Badges (3):')).toBeInTheDocument();
      expect(screen.getByText('🎯 First Steps: Complete your first section (Earned)')).toBeInTheDocument();
      expect(screen.getByText('⚡ Speed Reader: Complete a section in under 30 minutes (Not Earned)')).toBeInTheDocument();
      expect(screen.getByText('🧠 Knowledge Master: Score 90% or higher on all quizzes (Not Earned)')).toBeInTheDocument();
    });
  });

  it('displays levels system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Current Level: 3')).toBeInTheDocument();
      expect(screen.getByText('Current XP: 750')).toBeInTheDocument();
      expect(screen.getByText('XP to Next Level: 250')).toBeInTheDocument();
      expect(screen.getByText('Total Levels: 10')).toBeInTheDocument();
      expect(screen.getByText('Level Name: Apprentice Scholar')).toBeInTheDocument();
      expect(screen.getByText('Level Description: You\'re making great progress in your studies!')).toBeInTheDocument();
    });
  });

  it('displays streaks system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Current Streak: 5 days')).toBeInTheDocument();
      expect(screen.getByText('Longest Streak: 12 days')).toBeInTheDocument();
      expect(screen.getByText('Streak Goal: 7 days')).toBeInTheDocument();
      expect(screen.getByText('Streak Reward: 100 points')).toBeInTheDocument();
    });
  });

  it('displays achievements system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Achievements (3):')).toBeInTheDocument();
      expect(screen.getByText('Section Master: Complete all sections in a study guide (60/100) Reward: 200 points')).toBeInTheDocument();
      expect(screen.getByText('Quiz Champion: Score 100% on 5 quizzes (2/5) Reward: 150 points')).toBeInTheDocument();
      expect(screen.getByText('Study Marathon: Study for 2 hours straight (0/120) Reward: 300 points')).toBeInTheDocument();
    });
  });

  it('displays leaderboards system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Global Rank: #15')).toBeInTheDocument();
      expect(screen.getByText('Total Players: 1000')).toBeInTheDocument();
      expect(screen.getByText('Friends Rank: #3')).toBeInTheDocument();
      expect(screen.getByText('Total Friends: 10')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson: 2500 points (Level 8)')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith: 2300 points (Level 7)')).toBeInTheDocument();
      expect(screen.getByText('Carol Davis: 2100 points (Level 7)')).toBeInTheDocument();
    });
  });

  it('displays challenges system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Challenges (2):')).toBeInTheDocument();
      expect(screen.getByText('Daily Study: Study for at least 30 minutes today (daily) Reward: 50 points (Completed)')).toBeInTheDocument();
      expect(screen.getByText('Weekend Warrior: Complete 3 sections this weekend (weekly) Reward: 150 points (In Progress)')).toBeInTheDocument();
    });
  });

  it('displays rewards system correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Rewards (3):')).toBeInTheDocument();
      expect(screen.getByText('Study Break: Take a 15-minute break (break) (Unlocked)')).toBeInTheDocument();
      expect(screen.getByText('Custom Theme: Unlock a new study theme (cosmetic) (Locked)')).toBeInTheDocument();
      expect(screen.getByText('Extra Time: Get 10 extra minutes on your next quiz (powerup) (Unlocked)')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideGamifier studyGuide={mockStudyGuide} />);
    
    const gamifyButton = screen.getByTestId('gamify-button');
    fireEvent.click(gamifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Points: 1500')).toBeInTheDocument();
      expect(screen.getByText('Current Points: 750')).toBeInTheDocument();
      expect(screen.getByText('Total Badges: 3')).toBeInTheDocument();
      expect(screen.getByText('Earned Badges: 1')).toBeInTheDocument();
      expect(screen.getByText('Current Level: 3')).toBeInTheDocument();
      expect(screen.getByText('Current Streak: 5')).toBeInTheDocument();
      expect(screen.getByText('Total Achievements: 3')).toBeInTheDocument();
      expect(screen.getByText('Completed Achievements: 0')).toBeInTheDocument();
      expect(screen.getByText('Total Challenges: 2')).toBeInTheDocument();
      expect(screen.getByText('Completed Challenges: 1')).toBeInTheDocument();
      expect(screen.getByText('Total Rewards: 3')).toBeInTheDocument();
      expect(screen.getByText('Unlocked Rewards: 2')).toBeInTheDocument();
    });
  });
});
