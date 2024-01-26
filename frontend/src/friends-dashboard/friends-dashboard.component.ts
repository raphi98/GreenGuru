import {Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";

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
                public dialog: MatDialog) {
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

  openConfirmDialog(friendId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeFriend(friendId);
      }
    });
  }

  removeFriend(friendId: number): void {
    // Logic to remove the friend from the user's friends list
    // This could involve calling an API endpoint to update the user's friends list on the backend
    this.friends = this.friends.filter(friend => friend.id !== friendId);
  }

}
