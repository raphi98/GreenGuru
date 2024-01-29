import {Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import { FriendsService } from '../services/friends.service';
import {InviteFriendsComponent} from "../invite-friends/invite-friends.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-friends-dashboard',
  templateUrl: './friends-dashboard.component.html',
  styleUrls: ['./friends-dashboard.component.scss']
})
export class FriendsDashboardComponent implements OnInit{
    userId: number | null = null;
    username: string = '';
    score: number = 0;
    friends: any[] = [];

    constructor(private authService: AuthService,
                public dialog: MatDialog,
                private friendsService: FriendsService,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
      this.userId = this.authService.getUserIdFromToken();
      if (this.userId !== null) {
        this.loadFriendsDetails(this.userId);
      }
    }

  loadFriendsDetails(userId: number): void {
    this.authService.getUserDetails(userId).subscribe(
      userDetails => {
        this.username = userDetails.username;
        this.score = userDetails.score;
        this.friends = userDetails.friends.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
      },
      error => {
        console.error('Error loading user details', error);
      }
    );
  }

  openConfirmDialog(name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeFriend(name);
      }
    });
  }

  openAddFriendDialog(): void {
    const dialogRef = this.dialog.open(InviteFriendsComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addFriend(result.username);
      }
    });
  }

  addFriend(username: string): void {
    if(this.userId) {
      this.friendsService.addFriend(this.userId, username).subscribe({
        next: (response) => {
          this.snackBar.open(`${username} is now your friend.`, '', {
            duration: 5000,
          });
        },
        error: (error) => {
          this.snackBar.open(`${username} is not registered on this platform`, '', {
            duration: 5000,
          });
        }
      });
    }
  }
  removeFriend(name: string): void {
    if(this.userId) {
      this.friendsService.removeFriend(this.userId, name).subscribe({
        next: (response) => {
          this.friends = this.friends.filter(friend => friend.name !== name);
          this.snackBar.open(`${name} is removed from your friends list.`, '', {
            duration: 5000,
          });
        },
        error: (error) => {
          this.snackBar.open(`${name} could not be removed.`, '', {
            duration: 5000,
          });
        }
      });
    }
  }
}
