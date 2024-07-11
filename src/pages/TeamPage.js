function TeamPage() {
    return (
        <div className="projects" style={styles.container}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            <h1>Team</h1>
        
          </div>
        </div>
      );
    }
    
    const styles = {
      container: {
        position: "absolute", // Position it relative to the parent
        left: 0, // Start from the left
        right: 0, // Stretch to the right
        top: 80, // Start from the top
        bottom: 0, // Stretch to the bottom
        backgroundColor: "white", // Set the background color to blue
        overflow: "hidden", // Hide the overflowing content
      },
    };

export default TeamPage;